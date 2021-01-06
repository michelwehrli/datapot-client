import FormHeadingComponent from '~/components/form/form-heading/form-heading'
import InputDateComponent from '~/components/form/input-date/input-date'
import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import InputTextareaComponent from '~/components/form/input-textarea/input-textarea'
import InputMultipleComponent from '~/components/form/multiple/multiple'
import IAddress from '~/interfaces/data/IAddress'
import ICategory from '~/interfaces/data/ICategory'
import ICompany from '~/interfaces/data/ICompany'
import ICompanyWithLocation from '~/interfaces/data/ICompanyWithLocation'
import IContact from '~/interfaces/data/IContact'
import IEmail from '~/interfaces/data/IEmail'
import IPhonenumber from '~/interfaces/data/IPhonenumber'
import ISocialmedia from '~/interfaces/data/ISocialmedia'
import DataService from '~/services/DataService'
import Table from '../extend/Table'
import Address from './Address'
import Category from './Category'
import CompanyWithLocation from './CompanyWithLocation'
import Email from './Email'
import Gender from './Gender'
import Phonenumber from './Phonenumber'
import Relationship from './Relationship'
import RWStatus from './RWStatus'
import Salutation from './Salutation'
import Socialmedia from './Socialmedia'
import Title from './Title'

export default class Contact extends Table implements IContact {
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
  phonenumbers_business: Phonenumber[]
  phonenumbers_private: Phonenumber[]
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
    this.gender = data.gender ? new Gender(data.gender) : undefined
    this.salutation = data.salutation
      ? new Salutation(data.salutation)
      : undefined
    this.title = data.title ? new Title(data.title) : undefined
    this.additional_names = data.additional_names ? data.additional_names : []
    this.addresses = []
    if (data.addresses) {
      data.addresses.forEach((address: IAddress) => {
        this.addresses.push(new Address(address))
      })
    }
    this.companiesWithLocation = []
    if (data.companiesWithLocation) {
      data.companiesWithLocation.forEach(
        (companyWithLocation: ICompanyWithLocation) => {
          this.companiesWithLocation.push(
            new CompanyWithLocation(companyWithLocation)
          )
        }
      )
    }
    this.department = data.department ? data.department : undefined
    this.positions = data.positions ? data.positions : []
    this.phonenumbers_business = []
    if (data.phonenumbers_business) {
      data.phonenumbers_business.forEach((phonenumber: IPhonenumber) => {
        this.phonenumbers_business.push(new Phonenumber(phonenumber))
      })
    }
    this.phonenumbers_private = []
    if (data.phonenumbers_private) {
      data.phonenumbers_private.forEach((phonenumber: IPhonenumber) => {
        this.phonenumbers_private.push(new Phonenumber(phonenumber))
      })
    }
    this.emails = []
    if (data.emails) {
      data.emails.forEach((email: IEmail) => {
        this.emails.push(new Email(email))
      })
    }
    this.partner = data.partner ? new Contact(data.partner) : undefined
    this.birthdate = data.birthdate ? data.birthdate : undefined
    this.websites = data.websites ? data.websites : []
    this.social_medias = []
    if (data.social_medias) {
      data.social_medias.forEach((socialmedia: ISocialmedia) => {
        this.social_medias.push(new Socialmedia(socialmedia))
      })
    }
    this.remarks = data.remarks ? data.remarks : undefined
    this.rwstatus = data.rwstatus ? new RWStatus(data.rwstatus) : undefined
    this.relationship = data.relationship
      ? new Relationship(data.relationship)
      : undefined
    this.categories = []
    if (data.categories) {
      data.categories.forEach((category: ICategory) => {
        this.categories.push(new Category(category))
      })
    }
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    if (this.givenname && this.surname) {
      return `${this.givenname} ${this.surname}`
    } else if (this.surname) {
      return this.surname
    } else if (this.givenname) {
      return this.givenname
    }
    return null
  }

  public validate(): boolean {
    this.fieldSurname.classList.toggle('error', !this.surname)
    this.fieldGivenname.classList.toggle('error', !this.givenname)

    let valid = !!this.surname && !!this.givenname
    for (const address of this.addresses) {
      const innerValid = address.validate()
      if (valid) valid = innerValid
    }
    for (const email of this.emails) {
      const innerValid = email.validate()
      if (valid) valid = innerValid
    }
    for (const phonenumber of this.phonenumbers_business) {
      const innerValid = phonenumber.validate()
      if (valid) valid = innerValid
    }
    for (const phonenumber of this.phonenumbers_private) {
      const innerValid = phonenumber.validate()
      if (valid) valid = innerValid
    }
    for (const sm of this.social_medias) {
      const innerValid = sm.validate()
      if (valid) valid = innerValid
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

    return {
      ...(isInitial && {
        __heading_1: new FormHeadingComponent('Privat'),
        gender: new InputSelectComponent(
          (value: Gender) => (this.gender = value),
          await Gender.getSelectMap('data', 'gender'),
          this.gender ? this.gender.uniquename : undefined
        ),
        salutation: new InputSelectComponent(
          (value: Salutation) => (this.salutation = value),
          await Salutation.getSelectMap('data', 'salutation'),
          this.salutation ? this.salutation.uniquename : undefined
        ),
        title: new InputSelectComponent(
          (value: Title) => (this.title = value),
          await Title.getSelectMap('data', 'title'),
          this.title ? this.title.uniquename : undefined
        ),
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
        partner: new InputSelectComponent(
          (value: Contact) => (this.partner = value),
          await Contact.getSelectMap(),
          this.partner ? this.partner.id : undefined
        ),
        __heading_2: new FormHeadingComponent('Geschäftlich'),
        companiesWithLocation: new InputMultipleComponent(
          async (values: CompanyWithLocation[]) =>
            (this.companiesWithLocation = values),
          this.companiesWithLocation,
          () => new CompanyWithLocation()
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
          () => new Address()
        ),
        emails: new InputMultipleComponent(
          (value: Email[]) => (this.emails = value),
          this.emails,
          () => new Email(),
          true
        ),
        phonenumbers_business: new InputMultipleComponent(
          (value: Phonenumber[]) => (this.phonenumbers_business = value),
          this.phonenumbers_business,
          () => new Phonenumber(),
          true
        ),
        phonenumbers_private: new InputMultipleComponent(
          (value: Phonenumber[]) => (this.phonenumbers_private = value),
          this.phonenumbers_private,
          () => new Phonenumber(),
          true
        ),
        __heading_4: new FormHeadingComponent('Weiteres'),
        social_medias: new InputMultipleComponent(
          (value: Socialmedia[]) => (this.social_medias = value),
          this.social_medias,
          () => new Socialmedia(),
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
        rwstatus: new InputSelectComponent(
          (value: RWStatus) => (this.rwstatus = value),
          await RWStatus.getSelectMap('data', 'rwstatus'),
          this.rwstatus ? this.rwstatus.uniquename : undefined
        ),
        relationship: new InputSelectComponent(
          (value: Relationship) => (this.relationship = value),
          await Relationship.getSelectMap('data', 'relationship'),
          this.relationship ? this.relationship.uniquename : undefined
        ),
        categories: new InputMultipleComponent(
          (value: Category[]) => (this.categories = value),
          this.categories,
          () => new Category()
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

  public getDetail(): string {
    const mobilePhones: Phonenumber[] = []
    const businessPhones: Phonenumber[] = []
    const homePhones: Phonenumber[] = []
    this.phonenumbers_business.map((p: Phonenumber) => {
      if (p.line && p.line.uniquename === 'mobile') {
        mobilePhones.push(p)
      } else {
        businessPhones.push(p)
      }
    })
    this.phonenumbers_private.map((p: Phonenumber) => {
      if (p.line && p.line.uniquename === 'mobile') {
        mobilePhones.push(p)
      } else {
        homePhones.push(p)
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
            ${this.salutation ? `<p>${this.salutation.toString()}</p>` : ''}
            ${this.title ? `<p>${this.title.toString()}</p>` : ''}
            <p>
              ${this.givenname ? this.givenname : ''}${
      this.surname ? ` <u>${this.surname}</u>` : ''
    }</p>
            ${
              this.birthdate
                ? `
                <h4>Geburtstag</h4><p>${new Date(
                  this.birthdate
                ).toLocaleDateString('ch-DE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}</p>`
                : ''
            }
            ${
              this.websites && this.websites.length
                ? `<h4>Websites</h4>
                ${this.websites.map((w) => {
                  return `<p><a href="${w}" target="_blank" rel="noopener">${w}</a></p>`
                })}`
                : ''
            }
          </div>
          <div class="flex-item">
            <h4>Geschäftliche Informationen</h4>
            ${
              this.positions
                ? this.positions.map((p) => {
                    return `<p>${p}</p>`
                  })
                : ''
            }
            ${this.department ? `${this.department}` : ''}
            <h4>Status</h4>
            ${this.rwstatus ? `<p>${this.rwstatus.label}</p>` : ''}
            ${this.relationship ? `<p>${this.relationship.label}</p>` : ''}
            ${
              this.categories
                ? `<p>${this.categories
                    .map((c) => {
                      return c.label
                    })
                    .join(', ')}</p>`
                : ''
            }
            ${
              this.remarks
                ? `
              <h4>Status</h4>
              <p>${this.remarks}</p>
              `
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
                  .map((address) => {
                    return `<p>${address.toString('<br />')}</p>`
                  })
                  .join('<br />')}
                `
                : ''
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              this.companiesWithLocation && this.companiesWithLocation.length
                ? `
                <h4>Firmen</h4>
                ${this.companiesWithLocation
                  .map((companyWithLocation) => {
                    return `<p>${companyWithLocation.company.toString()}
                      <br />
                      ${companyWithLocation.address.toString('<br />')}</p>`
                  })
                  .join('<br />')}
                `
                : ''
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
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }">${p.toString()}</a></p>`
                  })
                  .join('')}`
                : ''
            }
            ${
              homePhones && homePhones.length
                ? `
                <h4>Privatnummern</h4>
                ${homePhones
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }">${p.toString()}</a></p>`
                  })
                  .join('')}`
                : ''
            }
            ${
              businessPhones && businessPhones.length
                ? `
                <h4>Geschäftsnummern</h4>
                ${businessPhones
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }">${p.toString()}</a></p>`
                  })
                  .join('')}`
                : ''
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              privateEmail && privateEmail.length
                ? `
                <h4>Private E-Mail Adressen</h4>
                ${privateEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}">${e.address}</a></p>`
                  })
                  .join('')}`
                : ''
            }
            ${
              businessEmail && businessEmail.length
                ? `
                <h4>Geschäftliche E-Mail Adressen</h4>
                ${businessEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}">${e.address}</a></p>`
                  })
                  .join('')}`
                : ''
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              this.social_medias && this.social_medias.length
                ? `
                <h4>Soziale Medien</h4>
                ${this.social_medias
                  .map((sm) => {
                    return `<p><a href="${sm.url}" target="_blank" rel="noopener">${sm.type.label}</a></p>`
                  })
                  .join('')}
                <br />`
                : ''
            }
            ${
              businessEmail && businessEmail.length
                ? `
                <h4>Geschäftliche E-Mail Adressen</h4>
                ${businessEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}">${e.address}</a></p>`
                  })
                  .join('')}`
                : ''
            }
          </div>
        </div>
      </div>

      <!--<div class="flex-container">
        <div class="flex">
          <p>${this.title ? this.title.toString() : '-'}</p>
          <p>${this.toString()}</p>
          <p>${this.partner ? this.partner.toString() : '-'}</p>
          <p>${this.addresses
            .map((address) => {
              return address.toString('<br />')
            })
            .join('')}</p>
          <p>${this.emails
            .map((email) => {
              return `<a href="mailto:${email.toString()}">${email.toString()}</a>`
            })
            .join('<br />')}</p>
          <p>${this.phonenumbers_business
            .map((number) => {
              return `<a href="tel:${number.toString()}">${number.toString()}</a>`
            })
            .join('<br />')}</p>
          <p>${this.phonenumbers_private
            .map((number) => {
              return `<a href="tel:${number.toString()}">${number.toString()}</a>`
            })
            .join('<br />')}</p>
          <p>${this.companiesWithLocation
            .map((companyWithLocation) => {
              return companyWithLocation.toString()
            })
            .join('<br />')}</p>
          <p>${this.positions
            .map((position) => {
              return position
            })
            .join('<br />')}</p>
          <p>${this.social_medias
            .map((social_media) => {
              return `<a href="${social_media.toString()}" target="_blank" rel="noopener">${social_media.type.toString()}</a>`
            })
            .join('<br />')}</p>
          <p>${this.rwstatus.toString()}</p>
          <p>${this.relationship.toString()}</p>
          <p>${this.categories
            .map((category) => {
              return category.toString()
            })
            .join('<br />')}</p>
          <p>${this.gender.toString()}</p>
          <p>${new Date(this.birthdate).toLocaleDateString('de-CH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}</p>
        </div>
      </div>-->
    `
  }

  public static async getSelectMap(): Promise<Map<string, any>> {
    const contacts = (await DataService.getData('data/contact')) as Contact[]
    const ret: Map<string, any> = new Map()
    for (const raw of contacts as ICompany[]) {
      const entry = new Contact(raw)
      ret[entry.id] = {
        realValue: entry,
        value: entry.toString(),
      }
    }
    return ret
  }
}
