import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import ModalComponent from '~/components/modal/modal'
import EditContent from '~/contents/edit/edit'
import IEmail from '~/interfaces/data/IEmail'
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

    this.fieldType = new InputSelectComponent(
      (value: EmailType) => (this.type = value),
      await EmailType.getSelectMap('data', 'email_type'),
      this.type ? this.type.uniquename : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(true, ['email_type'], async (value: EmailType) => {
            this.fieldType.update(
              await EmailType.getSelectMap('data', 'email_type'),
              value.uniquename
            )
            this.type = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )

    return {
      address: this.fieldAddress,
      type: this.fieldType,
    }
  }
}
