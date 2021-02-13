import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import { DataService } from '~/internal'
import { ObjectFactory } from '~/services/ObjectFactory'

import { Table } from './Table'

export class KeyValue extends Table implements IKeyValue {
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
    if (this.fieldLabel) {
      this.fieldLabel.classList.toggle('error', !this.label)
    }
    return !!this.uniquename && !!this.label
  }

  public fieldUniquename: InputTextComponent
  public fieldLabel: InputTextComponent

  public async getField(): Promise<any> {
    this.fieldUniquename = new InputTextComponent(
      (value: string) => (this.uniquename = value),
      EInputType.TEXT,
      this.uniquename,
      undefined,
      true
    )
    this.fieldLabel = new InputTextComponent(
      (value: string) => (this.label = value),
      EInputType.TEXT,
      this.label,
      undefined,
      true
    )

    return {
      uniquename: this.fieldUniquename,
      label: this.fieldLabel,
    }
  }

  public static async getSelectMap<T>(
    db: string,
    table: string
  ): Promise<any[]> {
    let values = (await DataService.getData(`${db}/${table}`)) as T[]
    const datamodel = await DataService.getDatamodel(table)
    const sortBy = datamodel?.__meta?.sort
    if (sortBy) {
      values = values.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return -1
        }
        if (a[sortBy] > b[sortBy]) {
          return 1
        }
        return 0
      })
    }
    const ret: any[] = []
    if (values && values.length) {
      for (const raw of values as IKeyValue[]) {
        const entry = ObjectFactory.createFromName(table, raw) as any
        ret.push({
          key: entry.uniquename,
          realValue: entry,
          value: entry.label,
        })
      }
    }
    return ret
  }
}
