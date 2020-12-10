import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import { ETypeMatch } from '~/enums/ETypeMatch'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import DataService from '~/services/DataService'
import Table from './Table'

export default class KeyValue extends Table implements IKeyValue {
  uniquename: string
  label: string

  constructor(data: IKeyValue = {}) {
    super(data as any)
    this.uniquename = data.uniquename ? data.uniquename : undefined
    this.label = data.label ? data.label : undefined
  }

  public getId(): string {
    return this.uniquename
  }

  public toString(): string {
    return this.label
  }

  public validate(): boolean {
    if (this.fieldUniquename) {
      this.fieldUniquename.classList.toggle('error', !this.uniquename)
    }
    return !!this.uniquename
  }

  private fieldUniquename: InputTextComponent

  public async getField(): Promise<any> {
    this.fieldUniquename = new InputTextComponent(
      (value: string) => (this.uniquename = value),
      EInputType.TEXT,
      this.uniquename,
      undefined,
      true
    )
    return {
      uniquename: this.fieldUniquename,
      label: new InputTextComponent(
        (value: string) => (this.label = value),
        EInputType.TEXT,
        this.label
      ),
    }
  }

  public static async getSelectMap<T>(
    db: string,
    table: string
  ): Promise<Map<string, string>> {
    const values = await DataService.getData(`${db}/${table}`)
    const ret: Map<string, string> = new Map()
    for (const raw of values as IKeyValue[]) {
      const entry = new ETypeMatch[table](raw)
      ret[entry.uniquename] = { realValue: entry, value: entry.label }
    }
    return ret
  }
}
