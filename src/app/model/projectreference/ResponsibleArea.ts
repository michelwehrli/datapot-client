import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import IResponsibleArea from '~/interfaces/projectreference/IResponsibleArea'
import { DataService, ObjectFactory } from '~/internal'

import { KeyValue } from '../extend/KeyValue'

export class ResponsibleArea extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }

  public async getField(
    isInitial?: boolean,
    changed?: (value: ResponsibleArea) => void
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
          await ResponsibleArea.getSelectMap(),
          this.uniquename
        ),
      }),
    }
  }

  public static async getSelectMap(): Promise<any[]> {
    let values = await DataService.getData<ResponsibleArea[]>(
      'data/responsible_area'
    )
    const datamodel = await DataService.getDatamodel('responsible_area')
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
    for (const raw of values as IResponsibleArea[]) {
      const entry = ObjectFactory.create<ResponsibleArea>(
        'ResponsibleArea',
        raw
      )
      ret.push({ key: entry.uniquename, realValue: entry, value: entry.label })
    }
    return ret
  }
}
