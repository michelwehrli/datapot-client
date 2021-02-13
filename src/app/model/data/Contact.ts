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
    if (data.addresses) {
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
    const idParagraph = document.createElement('p')
    idParagraph.innerText = this.id ? this.id.toString() : null

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

    const genderSelect = await getSelect.call(
      this,
      'gender',
      this.gender ? this.gender.uniquename : undefined,
      Gender,
      'uniquename'
    )

    const salutationSelect = await getSelect.call(
      this,
      'salutation',
      this.salutation ? this.salutation.uniquename : undefined,
      Salutation,
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

    return {
      ...(isInitial && {
        __heading_1: new FormHeadingComponent('Privat'),
        gender: genderSelect,
        salutation: salutationSelect,
        title: titleSelect,
        surname: this.fieldSurname,
        givenname: this.fieldGivenname,
        additional_names: new InputMultipleComponent(
          (value: string[]) => (this.additional_names = value),
          this.additional_names,
          () => ''
        ),
        birthdate: new InputDateComponent(
          (value: number) => (this.birthdate = value),
          this.birthdate
        ),
        partner: partnerSelect,
        __heading_2: new FormHeadingComponent('Geschäftlich'),
        companiesWithLocation: new InputMultipleComponent(
          async (values: CompanyWithLocation[]) =>
            (this.companiesWithLocation = values),
          this.companiesWithLocation,
          () => ObjectFactory.create<CompanyWithLocation>('CompanyWithLocation')
        ),
        department: new InputTextComponent(
          (value: string) => (this.department = value),
          EInputType.TEXT,
          this.department
        ),
        positions: new InputMultipleComponent(
          (value: string[]) => (this.positions = value),
          this.positions,
          () => ''
        ),
        __heading_3: new FormHeadingComponent('Kommunikation'),
        addresses: new InputMultipleComponent(
          (value: Address[]) => (this.addresses = value),
          this.addresses,
          () => ObjectFactory.create<Address>('Address')
        ),
        emails: new InputMultipleComponent(
          (value: Email[]) => (this.emails = value),
          this.emails,
          () => ObjectFactory.create<Email>('Email'),
          true
        ),
        phonenumbers: new InputMultipleComponent(
          (value: Phonenumber[]) => (this.phonenumbers = value),
          this.phonenumbers,
          () => ObjectFactory.create<Phonenumber>('Phonenumber'),
          true
        ),
        __heading_4: new FormHeadingComponent('Weiteres'),
        social_medias: new InputMultipleComponent(
          (value: Socialmedia[]) => (this.social_medias = value),
          this.social_medias,
          () => ObjectFactory.create<Socialmedia>('Socialmedia'),
          true
        ),
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
        __heading_5: new FormHeadingComponent('Klassifizierung'),
        rwstatus: rwstatusSelect,
        relationship: relationshipSelect,
        categories: new InputMultipleComponent(
          (value: Category[]) => (this.categories = value),
          this.categories,
          () => ObjectFactory.create<Category>('Category')
        ),
      }),
      ...(!isInitial && {
        contact: new InputSelectComponent(
          (value: number) => (this.id = value),
          await Contact.getSelectMap(),
          this.id
        ),
      }),
    }
  }

  public async getDetail(): Promise<string> {
    const mobilePhones: Phonenumber[] = []
    const businessPhones: Phonenumber[] = []
    const homePhones: Phonenumber[] = []
    this.phonenumbers.map((p: Phonenumber) => {
      if (p.line.uniquename === 'mobile') {
        mobilePhones.push(p)
      } else {
        if (p.type.uniquename === 'business') {
          businessPhones.push(p)
        } else {
          homePhones.push(p)
        }
      }
    })

    const privateEmail = this.emails.filter((p) => {
      return p.type.uniquename === 'private'
    })
    const businessEmail = this.emails.filter((p) => {
      return p.type.uniquename === 'business'
    })

    return `
    <div class="container">
      <div class="flex">
        <div class="flex-item">
            <h4>Persönliche Informationen</h4>              
            ${`<p class="text-flex"><span>Anrede</span><span>${
              this.salutation ? this.salutation : '-'
            }</span></p>`}
              
            ${`<p class="text-flex"><span>Titel</span><span>${
              this.title ? this.title : '-'
            }</span></p>`}
              
            ${`<p class="text-flex"><span>Name</span><span>${this.toString(
              undefined,
              true
            )}</span></p>`}

            ${`<p class="text-flex"><span>Geburtstag</span><span>${
              this.birthdate
                ? new Date(this.birthdate).toLocaleDateString('de-CH', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                  })
                : '-'
            }</span></p>`}
            <br />              
            ${`<p class="text-flex"><span>Partner/in</span><span>${
              this.partner
                ? `${this.partner.toString()} <a class="iconlink" data-navigate="crm/detail/contact/${
                    this.partner.id
                  }"><i class="fa fa-external-link-alt"></i></a>`
                : '-'
            }</span></p>`}
            ${
              this.websites &&
              this.websites.filter((w) => {
                return new RegExp(/(https?:\/\/[^\s]+)/g).test(w)
              }).length
                ? `<h4>Websites</h4>
                ${this.websites
                  .map((w) => {
                    return `<p><a href="${w}" target="_blank" rel="noopener">${w}</a></p>`
                  })
                  .join('')}`
                : '<h4>Websites</h4><p>Keine Websites</p>'
            }
          </div>
          <div class="flex-item">
            <h4>Geschäftliche Informationen</h4>
            ${
              this.positions
                ? this.positions
                    .map((p, i) => {
                      return `<p class="text-flex"><span>${
                        !i ? 'Positionen' : ''
                      }</span><span>${p}</span></p>`
                    })
                    .join('')
                : ''
            }
            ${`<p class="text-flex"><span>Abteilung</span><span>${
              this.department ? this.department : '-'
            }</span></p>`}
            ${
              this.remarks
                ? `
              <h4>Bemerkungen</h4>
              <p class="remark">${this.remarks.split('\n').join('<br />')}</p>
              `
                : '<h4>Bemerkungen</h4><p class="remark"></p>'
            }
            ${
              !!this.rwstatus || !!this.relationship || !!this.categories.length
                ? '<h4>Kategorisierung</h4>'
                : '<h4>Kategorisierung</h4>'
            }
            ${`<p class="text-flex"><span>RW-Status</span><span>${
              this.rwstatus ? this.rwstatus.label : '-'
            }</span></p>`}
            ${`<p class="text-flex"><span>Beziehung</span><span>${
              this.relationship ? this.relationship.label : '-'
            }</span></p>`}
            ${
              this.categories
                ? this.categories
                    .map((category, i) => {
                      return `<p class="text-flex"><span>${
                        !i ? 'Kategorien' : ''
                      }</span><span>${category}</span></p>`
                    })
                    .join('')
                : ''
            }
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="flex-item">
          <div class="container">
            ${
              this.addresses && this.addresses.length
                ? `
                <h4>Adressen</h4>
                ${this.addresses
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
                  .join('<br />')}
                `
                : '<h4>Adressen</h4><p>Keine Adressen</p>'
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              this.companiesWithLocation &&
              this.companiesWithLocation.length &&
              this.companiesWithLocation.filter((companyWithLocation) => {
                return (
                  companyWithLocation.company && companyWithLocation.address
                )
              }).length
                ? `
                <h4>Firmen</h4>
                ${this.companiesWithLocation
                  .filter((companyWithLocation) => {
                    return (
                      companyWithLocation.company && companyWithLocation.address
                    )
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
                  .join('<br />')}
                `
                : '<h4>Firmen</h4><p>Keine Firmen</p>'
            }
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="flex-item">
          <div class="container">
            ${
              mobilePhones && mobilePhones.length
                ? `
                <h4>Mobilnummern</h4>
                ${mobilePhones
                  .filter((p) => {
                    return !!p
                  })
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4>Mobilnummern</h4><p>Keine Nummern</p>'
            }
            ${
              businessPhones && businessPhones.length
                ? `
                <h4>Geschäftsnummern</h4>
                ${businessPhones
                  .filter((p) => {
                    return !!p
                  })
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4>Geschäftsnummern</h4><p>Keine Nummern</p>'
            }
            ${
              homePhones && homePhones.length
                ? `
                <h4>Privatnummern</h4>
                ${homePhones
                  .filter((p) => {
                    return !!p
                  })
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4>Privatnummern</h4><p>Keine Nummern</p>'
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              businessEmail &&
              businessEmail.length &&
              businessEmail.filter((email) => {
                return email.address && email.address.indexOf('@') > -1
              }).length
                ? `
                <h4>Geschäftliche E-Mail Adressen</h4>
                ${businessEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}"><i class="linkicon far fa-envelope"></i>${e.address}</a></p>`
                  })
                  .join('')}`
                : '<h4>Geschäftliche E-Mail Adressen</h4><p>Keine E-Mail-Adressen</p>'
            }
            ${
              privateEmail &&
              privateEmail.length &&
              privateEmail.filter((email) => {
                return email.address && email.address.indexOf('@') > -1
              }).length
                ? `
                <h4>Private E-Mail-Adressen</h4>
                ${privateEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}"><i class="linkicon far fa-envelope"></i>${e.address}</a></p>`
                  })
                  .join('')}`
                : '<h4>Private E-Mail-Adressen</h4><p>Keine E-Mail-Adressen</p>'
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              this.social_medias &&
              this.social_medias.length &&
              this.social_medias.filter((sm) => {
                return new RegExp(/(https?:\/\/[^\s]+)/g).test(sm.url)
              }).length
                ? `
                <h4>Soziale Medien</h4>
                ${this.social_medias
                  .map((sm) => {
                    return `<p><a href="${sm.url}" target="_blank" rel="noopener">${sm.type.label}</a></p>`
                  })
                  .join('')}
                <br />`
                : '<h4>Soziale Medien</h4><p>Kein Profile</p>'
            }
          </div>
        </div>
      </div>
    `
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
