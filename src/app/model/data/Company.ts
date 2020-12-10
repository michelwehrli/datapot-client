import FormHeadingComponent from '~/components/form/form-heading/form-heading'
import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import InputTextareaComponent from '~/components/form/input-textarea/input-textarea'
import InputMultipleComponent from '~/components/form/multiple/multiple'
import IAddress from '~/interfaces/data/IAddress'
import ICompany from '~/interfaces/data/ICompany'
import IEmail from '~/interfaces/data/IEmail'
import IPhonenumber from '~/interfaces/data/IPhonenumber'
import DataService from '~/services/DataService'
import Table from '../extend/Table'
import Address from './Address'
import Contact from './Contact'
import Email from './Email'
import Phonenumber from './Phonenumber'

export default class Company extends Table implements ICompany {
  id: number
  name: string
  addresses: Address[]
  emails: Email[]
  phonenumbers: Phonenumber[]
  contact_person: Contact
  websites?: string[]
  remarks?: string

  constructor(data: ICompany = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.name = data.name ? data.name : undefined
    this.addresses = []
    if (data.addresses) {
      data.addresses.forEach((address: IAddress) => {
        this.addresses.push(new Address(address))
      })
    }
    this.emails = []
    if (data.emails) {
      data.emails.forEach((email: IEmail) => {
        this.emails.push(new Email(email))
      })
    }
    this.phonenumbers = []
    if (data.phonenumbers) {
      data.phonenumbers.forEach((phonenumber: IPhonenumber) => {
        this.phonenumbers.push(new Phonenumber(phonenumber))
      })
    }
    this.contact_person = data.contact_person
      ? new Contact(data.contact_person)
      : undefined
    this.websites = data.websites ? data.websites : []

    this.remarks = data.remarks
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.name
  }

  public validate(): boolean {
    this.fieldName.classList.toggle('error', !this.name)
    let valid = !!this.name
    for (const address of this.addresses) {
      const innerValid = address.validate()
      if (valid) valid = innerValid
    }
    for (const email of this.emails) {
      const innerValid = email.validate()
      if (valid) valid = innerValid
    }
    for (const phonenumber of this.phonenumbers) {
      const innerValid = phonenumber.validate()
      if (valid) valid = innerValid
    }
    return valid
  }

  private fieldName: InputTextComponent

  public async getField(
    isInitial?: boolean,
    changed?: (value: Company) => void
  ): Promise<any> {
    const idParagraph = document.createElement('p')
    idParagraph.innerText = this.id ? this.id.toString() : null

    this.fieldName = new InputTextComponent(
      (value: string) => (this.name = value),
      EInputType.TEXT,
      this.name,
      undefined,
      true
    )

    return {
      ...(isInitial && {
        name: this.fieldName,
        __heading_1: new FormHeadingComponent('Kommunikation'),
        addresses: new InputMultipleComponent(
          (value: Address[]) => (this.addresses = value),
          this.addresses,
          () => new Address()
        ),
        contact_person: new InputSelectComponent(
          (value: Contact) => (this.contact_person = value),
          await Contact.getSelectMap(),
          this.contact_person ? this.contact_person.id : undefined
        ),
        emails: new InputMultipleComponent(
          (value: Email[]) => (this.emails = value),
          this.emails,
          () => new Email(),
          true
        ),
        phonenumbers: new InputMultipleComponent(
          (value: Phonenumber[]) => (this.phonenumbers = value),
          this.phonenumbers,
          () => new Phonenumber(),
          true
        ),
        __heading_2: new FormHeadingComponent('Weiteres'),
        websites: new InputMultipleComponent(
          (value: string[]) => (this.websites = value),
          this.websites,
          () => ''
        ),
        remarks: new InputTextareaComponent(
          (value: string) => (this.remarks = value),
          this.remarks,
          null,
          6
        ),
      }),
      ...(!isInitial && {
        company: new InputSelectComponent(
          changed,
          await Company.getSelectMap(),
          this.id
        ),
      }),
    }
  }

  public static async getSelectMap(): Promise<Map<string, any>> {
    const companies = (await DataService.getData('data/company')) as Company[]
    const ret: Map<string, any> = new Map()
    for (const raw of companies as ICompany[]) {
      const entry = new Company(raw)
      ret[entry.id] = { realValue: entry, value: entry.toString() }
    }
    return ret
  }
}
