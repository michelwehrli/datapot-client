import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import IRole from '~/interfaces/projectreference/IRole'
import { DataService, ObjectFactory } from '~/internal'

import { KeyValue } from '../extend/KeyValue'

export class Role extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }

  public async getField(
    isInitial?: boolean,
    changed?: (value: Role) => void
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
          await Role.getSelectMap(),
          this.uniquename
        ),
      }),
    }
  }

  public static async getSelectMap(): Promise<Map<string, string>> {
    const values = await DataService.getData('data/role')
    const ret: Map<string, string> = new Map()
    for (const raw of values as IRole[]) {
      const entry = ObjectFactory.create<Role>('Role', raw)
      ret[entry.uniquename] = { realValue: entry, value: entry.label }
    }
    return ret
  }
}
