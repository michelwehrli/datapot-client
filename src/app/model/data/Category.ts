import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import ICategory from '~/interfaces/data/ICategory'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import { DataService, ObjectFactory } from '~/internal'
import { KeyValue } from '../extend/KeyValue'

export class Category extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }

  public validate(): boolean {
    if (this.fieldUniquename) {
      this.fieldUniquename.classList.toggle('error', !this.uniquename)
    }
    if (this.fieldLabel) {
      this.fieldLabel.classList.toggle('error', !this.label)
    }
    if (this.select) {
      this.select.classList.toggle('error', !this.uniquename)
    }
    return !!this.uniquename && !!this.label
  }

  private select: InputSelectComponent

  public async getField(
    isInitial?: boolean,
    changed?: (value: Category) => void
  ): Promise<any> {
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
      this.label
    )

    this.select = new InputSelectComponent(
      changed,
      await Category.getSelectMap(),
      this.uniquename,
      true
    )

    return {
      ...(isInitial && {
        uniquename: this.fieldUniquename,
        label: this.fieldLabel,
      }),
      ...(!isInitial && {
        label: this.select,
      }),
    }
  }

  public static async getSelectMap(): Promise<Map<string, string>> {
    const values = await DataService.getData('data/category')
    const ret: Map<string, string> = new Map()
    for (const raw of values as ICategory[]) {
      const entry = ObjectFactory.create<Category>('Category', raw)
      ret[entry.uniquename] = { realValue: entry, value: entry.label }
    }
    return ret
  }
}
