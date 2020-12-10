import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IKeyValue from '~/interfaces/extend/IKeyValue'
import ICompetenceField from '~/interfaces/projectreference/ICompetenceField'
import DataService from '~/services/DataService'
import KeyValue from '../extend/KeyValue'

export default class CompetenceField extends KeyValue {
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

  public static async getSelectMap(): Promise<Map<string, string>> {
    const values = await DataService.getData('data/competence_field')
    const ret: Map<string, string> = new Map()
    for (const raw of values as ICompetenceField[]) {
      const entry = new CompetenceField(raw)
      ret[entry.uniquename] = { realValue: entry, value: entry.label }
    }
    return ret
  }
}
