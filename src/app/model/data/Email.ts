import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IEmail from '~/interfaces/data/IEmail'
import { getSelect, ObjectFactory } from '~/internal'

import { Table } from '../extend/Table'
import { EmailType } from './EmailType'

export class Email extends Table implements IEmail {
  id: number
  address: string
  type: EmailType

  constructor(data: IEmail = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.address = data.address ? data.address : undefined
    this.type = data.type
      ? ObjectFactory.create<EmailType>('EmailType', data.type)
      : undefined
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

  public async getField(
    isInitial?: boolean,
    changed?: (value: Email) => void
  ): Promise<any> {
    this.fieldAddress = new InputTextComponent(
      (value: string) => {
        this.address = value
        if (changed) {
          changed(this)
        }
      },
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
      'type',
      (value: any) => {
        this.type = value
        if (changed) {
          changed(this)
        }
      }
    )

    return {
      address: this.fieldAddress,
      type: this.fieldType,
    }
  }
}
