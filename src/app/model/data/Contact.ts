import FormHeadingComponent from '~/components/form/form-heading/form-heading'
import InputDateComponent from '~/components/form/input-date/input-date'
import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import InputTextareaComponent from '~/components/form/input-textarea/input-textarea'
import InputMultipleComponent from '~/components/form/multiple/multiple'
import ModalComponent from '~/components/modal/modal'
import EditContent from '~/contents/edit/edit'
import IAddress from '~/interfaces/data/IAddress'
import ICategory from '~/interfaces/data/ICategory'
import ICompany from '~/interfaces/data/ICompany'
import ICompanyWithLocation from '~/interfaces/data/ICompanyWithLocation'
import IContact from '~/interfaces/data/IContact'
import IEmail from '~/interfaces/data/IEmail'
import IPhonenumber from '~/interfaces/data/IPhonenumber'
import ISocialmedia from '~/interfaces/data/ISocialmedia'
import { DataService, getSelect, ObjectFactory } from '~/internal'

import { Table } from '../extend/Table'
import { Address } from './Address'
import { Category } from './Category'
import { CompanyWithLocation } from './CompanyWithLocation'
import { Email } from './Email'
import { Gender } from './Gender'
import { Phonenumber } from './Phonenumber'
import { Relationship } from './Relationship'
import { RWStatus } from './RWStatus'
import { Salutation } from './Salutation'
import { Socialmedia } from './Socialmedia'
import { Title } from './Title'
import template from '../../layouts/contact.html'
import Templater from '~/services/Templater'
import HorizontalWrapperComponent from '~/components/form/horizontal-wrapper/horizontal-wrapper'

export class Contact extends Table implements IContact {
  id: number
  givenname?: string
  surname?: string
  gender?: Gender
  salutation?: Salutation
  title?: Title
  additional_names?: string[]
  addresses: Address[]
  companiesWithLocation: CompanyWithLocation[]
  department?: string
  positions?: string[]
  phonenumbers: Phonenumber[]
  emails: Email[]
  birthdate?: number
  partner?: Contact
  websites?: string[]
  social_medias: Socialmedia[]
  remarks?: string
  rwstatus?: RWStatus
  relationship?: Relationship
  categories: Category[]

  constructor(data: IContact = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.givenname = data.givenname ? data.givenname : undefined
    this.surname = data.surname ? data.surname : undefined
    this.gender = data.gender
      ? ObjectFactory.create<Gender>('Gender', data.gender)
      : undefined
    this.salutation = data.salutation
      ? ObjectFactory.create<Salutation>('Salutation', data.salutation)
      : undefined
    this.title = data.title
      ? ObjectFactory.create<Title>('Title', data.title)
      : undefined
    this.additional_names = data.additional_names ? data.additional_names : []
    this.addresses = []
    if (data?.addresses) {
      data.addresses.forEach((address: IAddress) => {
        this.addresses.push(ObjectFactory.create<Address>('Address', address))
      })
    }
    this.companiesWithLocation = []
    if (data.companiesWithLocation) {
      data.companiesWithLocation.forEach(
        (companyWithLocation: ICompanyWithLocation) => {
          this.companiesWithLocation.push(
            ObjectFactory.create<CompanyWithLocation>(
              'CompanyWithLocation',
              companyWithLocation
            )
          )
        }
      )
    }
    this.department = data.department ? data.department : undefined
    this.positions = data.positions ? data.positions : []
    this.phonenumbers = []
    if (data.phonenumbers) {
      data.phonenumbers.forEach((phonenumber: IPhonenumber) => {
        this.phonenumbers.push(
          ObjectFactory.create<Phonenumber>('Phonenumber', phonenumber)
        )
      })
    }
    this.emails = []
    if (data.emails) {
      data.emails.forEach((email: IEmail) => {
        this.emails.push(ObjectFactory.create<Email>('Email', email))
      })
    }
    this.partner = data.partner
      ? ObjectFactory.create<Contact>('Contact', data.partner)
      : undefined
    this.birthdate = data.birthdate ? data.birthdate : undefined
    this.websites = data.websites ? data.websites : []
    this.social_medias = []
    if (data.social_medias) {
      data.social_medias.forEach((socialmedia: ISocialmedia) => {
        this.social_medias.push(
          ObjectFactory.create<Socialmedia>('Socialmedia', socialmedia)
        )
      })
    }
    this.remarks = data.remarks ? data.remarks : undefined
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

  public toString(reverse = false, withAddNames = false): string {
    let ret = []
    if (this.surname) {
      ret.push(this.surname)
    }
    if (this.givenname) {
      ret.push(this.givenname)
    }
    if (withAddNames && this.additional_names) {
      ret = ret.concat(this.additional_names)
    }
    if (reverse) {
      ret.reverse().join(' ')
    }
    return ret.join(' ')
  }

  public validate(): boolean {
    this.fieldSurname.classList.toggle('error', !this.surname)
    this.fieldGivenname.classList.toggle('error', !this.givenname)

    let valid = !!this.surname && !!this.givenname
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
    for (const cwl of this.companiesWithLocation) {
      if (valid) valid = cwl.validate()
    }
    return valid
  }

  private fieldSurname: InputTextComponent
  private fieldGivenname: InputTextComponent

  public async getField(isInitial: boolean): Promise<any> {
    this.fieldSurname = new InputTextComponent(
      (value: string) => (this.surname = value),
      EInputType.TEXT,
      this.surname,
      undefined,
      true
    )
    this.fieldGivenname = new InputTextComponent(
      (value: string) => (this.givenname = value),
      EInputType.TEXT,
      this.givenname,
      undefined,
      true
    )

    const salutationSelect = await getSelect.call(
      this,
      'salutation',
      this.salutation ? this.salutation.uniquename : undefined,
      Salutation,
      'uniquename'
    )
    const genderSelect = await getSelect.call(
      this,
      'gender',
      this.gender ? this.gender.uniquename : undefined,
      Gender,
      'uniquename'
    )
    const titleSelect = await getSelect.call(
      this,
      'title',
      this.title ? this.title.uniquename : undefined,
      Title,
      'uniquename'
    )
    const partnerSelect = new InputSelectComponent(
      (value: Contact) => (this.partner = value),
      await Contact.getSelectMap(),
      this.partner ? this.partner.id : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(true, ['contact'], async (value: Contact) => {
            partnerSelect.update(await Contact.getSelectMap(), value.id)
            this.partner = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )
    const rwstatusSelect = await getSelect.call(
      this,
      'rwstatus',
      this.rwstatus ? this.rwstatus.uniquename : undefined,
      RWStatus,
      'uniquename'
    )
    const relationshipSelect = await getSelect.call(
      this,
      'relationship',
      this.relationship ? this.relationship.uniquename : undefined,
      Relationship,
      'uniquename'
    )

    const additional_names = document.createElement('div')
    additional_names.innerHTML =
      '<p class="text-flex"><span>Weitere</span><span class="receiver"></span></p>'
    additional_names.querySelector('.receiver').appendChild(
      new InputMultipleComponent(
        (value: string[]) => (this.additional_names = value),
        this.additional_names,
        () => ''
      )
    )

    if (isInitial) {
      return {
        hasTemplate: true,
        fields: Templater.appendResolve(template, {
          salutation: salutationSelect,
          gender: genderSelect,
          title: titleSelect,
          name: new HorizontalWrapperComponent([
            this.fieldSurname,
            this.fieldGivenname,
          ]),
          additional_names: additional_names,
          birthdate: new InputDateComponent(
            (value: number) => (this.birthdate = value),
            this.birthdate
          ),
          partner: partnerSelect,
          websites: new InputMultipleComponent(
            (value: string[]) => (this.websites = value),
            this.websites,
            () => ''
          ),
          positions: new InputMultipleComponent(
            (value: string[]) => (this.positions = value),
            this.positions,
            () => ''
          ),
          department: new InputTextComponent(
            (value: string) => (this.department = value),
            EInputType.TEXT,
            this.department
          ),
          remarks: new InputTextareaComponent(
            (value: string) => (this.remarks = value),
            this.remarks,
            null,
            6
          ),
          rwstatus: rwstatusSelect,
          relationship: relationshipSelect,
          categories: new InputMultipleComponent(
            (value: Category[]) => (this.categories = value),
            this.categories,
            () => ObjectFactory.create<Category>('Category')
          ),
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
          socialmedia: new InputMultipleComponent(
            (value: Socialmedia[]) => (this.social_medias = value),
            this.social_medias,
            () => ObjectFactory.create<Socialmedia>('Socialmedia'),
            true
          ),
          companyaddresses: new InputMultipleComponent(
            async (values: CompanyWithLocation[]) =>
              (this.companiesWithLocation = values),
            this.companiesWithLocation,
            () =>
              ObjectFactory.create<CompanyWithLocation>('CompanyWithLocation')
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
        contact: new InputSelectComponent(
          (value: number) => (this.id = value),
          await Contact.getSelectMap(),
          this.id
        ),
      }
    }
  }

  public async getDetail(): Promise<string> {
    return Templater.resolve(template, {
      salutation: this.salutation?.toString(),
      gender: this.gender?.toString(),
      title: this.title?.toString(),
      name: this.toString(undefined, true),
      additional_names: '',
      birthdate: new Date(this.birthdate)?.toLocaleDateString('de-CH', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }),
      partner: this.partner?.toString(),
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
      positions: this.positions
        .map((p, i) => {
          return /*html*/ `${p}${i < this.positions.length - 1 ? `<br />` : ''}`
        })
        .join(''),
      department: this.department?.toString(),
      remarks: this.remarks,
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
      companyaddresses: this.companiesWithLocation
        .filter((companyWithLocation) => {
          return companyWithLocation.company && companyWithLocation.address
        })
        .map((companyWithLocation) => {
          return `<p>${companyWithLocation.company.toString()}<a class="iconlink" data-navigate="crm/detail/company/${
            companyWithLocation.company.id
          }"><i class="fa fa-external-link-alt"></i></a></p>
              <p>${companyWithLocation.address.toString(
                '<br />'
              )}<a href="https://www.google.com/maps?q=${
            companyWithLocation.company.name
          }, ${companyWithLocation.address.toString(
            ', '
          )}" target="_blank" rel="noopener" class="map"><i class="fa fa-map-marked-alt"></i></a></p>`
        })
        .join('<br />'),
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
    let values = await DataService.getData<Contact[]>('data/contact')
    const datamodel = await DataService.getDatamodel('contact')
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
      const entry = ObjectFactory.create<Contact>('Contact', raw)
      ret.push({
        key: entry.id,
        realValue: entry,
        value: entry.toString(true),
      })
    }
    return ret
  }
}
