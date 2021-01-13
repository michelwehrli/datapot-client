import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import ISocialmedia from '~/interfaces/data/ISocialmedia'
import { getSelect } from '~/services/Globals'
import Table from '../extend/Table'
import SocialmediaType from './SocialmediaType'

export default class Socialmedia extends Table implements ISocialmedia {
  id: number
  url: string
  type: SocialmediaType

  constructor(data: ISocialmedia = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.url = data.url ? data.url : undefined
    console.log(data)
    this.type = data.type ? new SocialmediaType(data.type) : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.url
  }

  public validate(): boolean {
    this.fieldUrl.classList.toggle('error', !this.url)
    this.fieldType.classList.toggle('error', !this.type)
    return !!this.url && !!this.type
  }

  private fieldUrl: InputTextComponent
  private fieldType: InputSelectComponent

  public async getField(): Promise<any> {
    this.fieldUrl = new InputTextComponent(
      (value: string) => (this.url = value),
      EInputType.TEXT,
      this.url,
      undefined,
      true
    )

    this.fieldType = await getSelect.call(
      this,
      'socialmedia_type',
      this.type ? this.type.uniquename : undefined,
      SocialmediaType,
      'uniquename',
      'type'
    )

    return {
      url: this.fieldUrl,
      type: this.fieldType,
    }
  }
}
