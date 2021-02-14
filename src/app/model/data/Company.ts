import FormHeadingComponent from '~/components/form/form-heading/form-heading'
import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import InputTextareaComponent from '~/components/form/input-textarea/input-textarea'
import InputMultipleComponent from '~/components/form/multiple/multiple'
import IAddress from '~/interfaces/data/IAddress'
import ICategory from '~/interfaces/data/ICategory'
import ICompany from '~/interfaces/data/ICompany'
import IEmail from '~/interfaces/data/IEmail'
import IPhonenumber from '~/interfaces/data/IPhonenumber'
import ISocialmedia from '~/interfaces/data/ISocialmedia'
import { DataService, getSelect } from '~/internal'
import { ObjectFactory } from '~/services/ObjectFactory'
import Templater from '~/services/Templater'

import { Table } from '../extend/Table'
import { Address } from './Address'
import { Category } from './Category'
import { Contact } from './Contact'
import { Email } from './Email'
import { Phonenumber } from './Phonenumber'
import { Relationship } from './Relationship'
import { RWStatus } from './RWStatus'
import { Socialmedia } from './Socialmedia'

import template from '../../layouts/company.html'

export class Company extends Table implements ICompany {
  id: number
  name: string
  addresses: Address[]
  emails: Email[]
  phonenumbers: Phonenumber[]
  contact_person: Contact
  websites?: string[]
  social_medias: Socialmedia[]
  remarks?: string
  rwstatus?: RWStatus
  relationship?: Relationship
  categories: Category[]

  constructor(data: ICompany = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.name = data.name ? data.name : undefined
    this.addresses = []
    if (data.addresses) {
      data.addresses.forEach((address: IAddress) => {
        this.addresses.push(ObjectFactory.create<Address>('Address', address))
      })
    }
    this.emails = []
    if (data.emails) {
      data.emails.forEach((email: IEmail) => {
        this.emails.push(ObjectFactory.create<Email>('Email', email))
      })
    }
    this.phonenumbers = []
    if (data.phonenumbers) {
      data.phonenumbers.forEach((phonenumber: IPhonenumber) => {
        this.phonenumbers.push(
          ObjectFactory.create<Phonenumber>('Phonenumber', phonenumber)
        )
      })
    }
    this.contact_person = data.contact_person
      ? ObjectFactory.create<Contact>('Contact', data.contact_person)
      : undefined
    this.websites = data.websites ? data.websites : []

    this.social_medias = []
    if (data.social_medias) {
      data.social_medias.forEach((socialmedia: ISocialmedia) => {
        this.social_medias.push(
          ObjectFactory.create<Socialmedia>('Socialmedia', socialmedia)
        )
      })
    }

    this.remarks = data.remarks

    this.rwstatus = data.rwstatus
      ? ObjectFactory.create<RWStatus>('RWStatus', data.rwstatus)
      : undefined
    this.relationship = data.relationship
      ? ObjectFactory.create<Relationship>('Relationship', data.relationship)
      : undefined
    this.categories = []
    if (data.categories) {
      data.categories.forEach((category: ICategory) => {
        this.categories.push(
          ObjectFactory.create<Category>('Category', category)
        )
      })
    }
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.name
  }

  public async getEmployees(): Promise<Contact[]> {
    const contactsRaw: any[] = await DataService.getData(
      `special/employees/${this.id}`,
      true
    )
    if (!contactsRaw || !contactsRaw.length) {
      return
    }
    return contactsRaw.map((cr) => {
      return ObjectFactory.create<Contact>('Contact', cr)
    })
  }

  public validate(): boolean {
    this.fieldName.classList.toggle('error', !this.name)

    let valid = !!this.name
    for (const address of this.addresses) {
      if (valid) valid = address.validate()
    }
    for (const email of this.emails) {
      if (valid) valid = email.validate()
    }
    for (const phonenumber of this.phonenumbers) {
      if (valid) valid = phonenumber.validate()
    }
    for (const sm of this.social_medias) {
      if (valid) valid = sm.validate()
    }
    for (const category of this.categories) {
      if (valid) valid = category.validate()
    }
    return valid
  }

  private fieldName: InputTextComponent
  private rwstatusSelect: InputSelectComponent
  private relationshipSelect: InputSelectComponent
  private categoriesInput: InputMultipleComponent

  public async getField(
    isInitial?: boolean,
    changed?: (value: Company) => void
  ): Promise<any> {
    this.fieldName = new InputTextComponent(
      (value: string) => (this.name = value),
      EInputType.TEXT,
      this.name,
      undefined,
      true
    )
    this.rwstatusSelect = await getSelect.call(
      this,
      'rwstatus',
      this.rwstatus ? this.rwstatus.uniquename : undefined,
      RWStatus,
      'uniquename'
    )
    this.relationshipSelect = await getSelect.call(
      this,
      'relationship',
      this.relationship ? this.relationship.uniquename : undefined,
      Relationship,
      'uniquename'
    )
    this.categoriesInput = new InputMultipleComponent(
      (value: Category[]) => (this.categories = value),
      this.categories,
      () => ObjectFactory.create<Category>('Category')
    )

    if (isInitial) {
      return {
        hasTemplate: true,
        fields: Templater.appendResolve(template, {
          name: this.fieldName,
          contact_person: new InputSelectComponent(
            (value: Contact) => (this.contact_person = value),
            await Contact.getSelectMap(),
            this.contact_person ? this.contact_person.id : undefined,
            undefined,
            undefined,
            true
          ),
          remarks: new InputTextareaComponent(
            (value: string) => (this.remarks = value),
            this.remarks,
            null,
            6
          ),
          rwstatus: this.rwstatusSelect,
          relationship: this.relationshipSelect,
          categories: this.categoriesInput,
          phonenumbers: new InputMultipleComponent(
            (value: Phonenumber[]) => (this.phonenumbers = value),
            this.phonenumbers,
            () => ObjectFactory.create<Phonenumber>('Phonenumber'),
            true
          ),
          emails: new InputMultipleComponent(
            (value: Email[]) => (this.emails = value),
            this.emails,
            () => ObjectFactory.create<Email>('Email'),
            true
          ),
          websites: new InputMultipleComponent(
            (value: string[]) => (this.websites = value),
            this.websites,
            () => ''
          ),
          socialmedia: new InputMultipleComponent(
            (value: Socialmedia[]) => (this.social_medias = value),
            this.social_medias,
            () => ObjectFactory.create<Socialmedia>('Socialmedia'),
            true
          ),
          addresses: new InputMultipleComponent(
            (value: Address[]) => (this.addresses = value),
            this.addresses,
            () => ObjectFactory.create<Address>('Address')
          ),
        }),
      }
    } else {
      return {
        company: new InputSelectComponent(
          changed,
          await Company.getSelectMap(),
          this.id
        ),
      }
    }
  }

  public async getDetail(): Promise<string> {
    return Templater.resolve(template, {
      name: this.toString(),
      contact_person: this.contact_person?.toString(),
      rwstatus: this.rwstatus?.toString(),
      relationship: this.relationship?.toString(),
      categories: this.categories
        .map((c, i) => {
          return /*html*/ `${c}${
            i < this.categories.length - 1 ? `<br />` : ''
          }`
        })
        .join(''),
      phonenumbers: this.phonenumbers
        .sort((a: Phonenumber, b: Phonenumber) => {
          if (a.line.label > b.line.label) return 1
          if (a.line.label < b.line.label) return -1
          return 0
        })
        .map((p: Phonenumber) => {
          return /*html*/ `
          <td>
            <p>
              <a href="tel:${p.number}">
                <i class="fa fa-phone-alt linkicon"></i>${p.toString()}</a>
            </p>
          </td>
          <td><span>${p.line.toString()}</span></td>
        </tr>`
        })
        .join(''),
      emails: this.emails
        .sort((a: Email, b: Email) => {
          if (a.type.label > b.type.label) return 1
          if (a.type.label < b.type.label) return -1
          return 0
        })
        .map((e: Email) => {
          return /*html*/ `
          <td>
            <p>
              <a href="mailto:${e.address}">
                <i class="fa fa-at linkicon"></i>${e.toString()}</a>
            </p>
          </td>
          <td><span>${e.type.toString()}</span></td>
        </tr>`
        })
        .join(''),
      websites: this.websites
        .map((w) => {
          return /*html*/ `
        <p>
          <a href="${
            w.indexOf('http') > -1 ? w : `https://${w}`
          }" target="_blank" rel="noopener">
            ${w}
            <i class="fa fa-external-link-alt linkicon"></i>
          </a>
        </p>`
        })
        .join(''),
      socialmedia: this.social_medias
        .map((s, i) => {
          return /*html*/ `
          <a href="${s.url}" target="_blank" rel="noopener">
            ${s.type.toString()}
            <i class="fa fa-external-link-alt linkicon"></i>
          </a>
          ${i < this.social_medias.length - 1 ? `<br />` : ''}`
        })
        .join(''),
      addresses: this.addresses
        .filter((address) => {
          return !!address
        })
        .map((address) => {
          return `<p>${address.toString(
            '<br />'
          )}<a href="https://www.google.com/maps?q=${address.toString(
            ', '
          )}" target="_blank" rel="noopener" class="map"><i class="fa fa-map-marked-alt"></i></a></p>`
        })
        .join('<br />'),
    })
  }

  public static async getSelectMap(): Promise<any[]> {
    let values = await DataService.getData<Company[]>('data/company')
    const datamodel = await DataService.getDatamodel('company')
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
    for (const raw of values as ICompany[]) {
      const entry = ObjectFactory.create<Company>('Company', raw)
      ret.push({ key: entry.id, realValue: entry, value: entry.toString() })
    }
    return ret
  }
}
