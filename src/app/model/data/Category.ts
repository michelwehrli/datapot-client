import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import ICategory from '~/interfaces/data/ICategory'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import DataService from '~/services/DataService'
import KeyValue from '../extend/KeyValue'

export default class Category extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }

  public async getField(
    isInitial?: boolean,
    changed?: (value: Category) => void
  ): Promise<any> {
    return {
      ...(isInitial && {
        uniquename: new InputTextComponent(
          (value: string) => (this.uniquename = value),
          EInputType.TEXT,
          this.uniquename,
          undefined,
          true
        ),
        label: new InputTextComponent(
          (value: string) => (this.label = value),
          EInputType.TEXT,
          this.label
        ),
      }),
      ...(!isInitial && {
        label: new InputSelectComponent(
          changed,
          await Category.getSelectMap(),
          this.uniquename
        ),
      }),
    }
  }

  public static async getSelectMap(): Promise<Map<string, string>> {
    const values = await DataService.getData('data/category')
    const ret: Map<string, string> = new Map()
    for (const raw of values as ICategory[]) {
      const entry = new Category(raw)
      ret[entry.uniquename] = { realValue: entry, value: entry.label }
    }
    return ret
  }
}
