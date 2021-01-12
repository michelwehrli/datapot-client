import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IEmail from '~/interfaces/data/IEmail'
import { getSelect } from '~/services/Globals'
import Table from '../extend/Table'
import EmailType from './EmailType'

export default class Email extends Table implements IEmail {
  id: number
  address: string
  type: EmailType

  constructor(data: IEmail = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.address = data.address ? data.address : undefined
    this.type = data.type ? new EmailType(data.type) : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.address
  }

  public validate(): boolean {
    this.fieldAddress.classList.toggle('error', !this.address)
    this.fieldType.classList.toggle('error', !this.type)
    return !!this.address && !!this.type
  }

  private fieldAddress: InputTextComponent
  private fieldType: InputSelectComponent

  public async getField(): Promise<any> {
    this.fieldAddress = new InputTextComponent(
      (value: string) => (this.address = value),
      EInputType.TEXT,
      this.address,
      undefined,
      true
    )

    this.fieldType = await getSelect.call(
      this,
      'email_type',
      this.type ? this.type.uniquename : undefined,
      EmailType,
      'uniquename',
      'type'
    )

    return {
      address: this.fieldAddress,
      type: this.fieldType,
    }
  }
}
