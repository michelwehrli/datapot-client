import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import ICompetenceField from '~/interfaces/projectreference/ICompetenceField'
import { DataService, ObjectFactory } from '~/internal'
import { KeyValue } from '../extend/KeyValue'

export class CompetenceField extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }

  public async getField(
    isInitial?: boolean,
    changed?: (value: CompetenceField) => void
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
          await CompetenceField.getSelectMap(),
          this.uniquename
        ),
      }),
    }
  }

  public static async getSelectMap(): Promise<any[]> {
    let values = await DataService.getData<CompetenceField[]>(
      'data/competence_field'
    )
    const datamodel = await DataService.getDatamodel('competence_field')
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
    for (const raw of values as ICompetenceField[]) {
      const entry = ObjectFactory.create<CompetenceField>(
        'CompetenceField',
        raw
      )
      ret.push({ key: entry.uniquename, realValue: entry, value: entry.label })
    }
    return ret
  }
}
