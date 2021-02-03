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

import { Table } from '../extend/Table'
import { Address } from './Address'
import { Category } from './Category'
import { Contact } from './Contact'
import { Email } from './Email'
import { Phonenumber } from './Phonenumber'
import { Relationship } from './Relationship'
import { RWStatus } from './RWStatus'
import { Socialmedia } from './Socialmedia'

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
    const idParagraph = document.createElement('p')
    idParagraph.innerText = this.id ? this.id.toString() : null

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

    return {
      ...(isInitial && {
        name: this.fieldName,
        __heading_1: new FormHeadingComponent('Kommunikation'),
        addresses: new InputMultipleComponent(
          (value: Address[]) => (this.addresses = value),
          this.addresses,
          () => ObjectFactory.create<Address>('Address')
        ),
        contact_person: new InputSelectComponent(
          (value: Contact) => (this.contact_person = value),
          await Contact.getSelectMap(),
          this.contact_person ? this.contact_person.id : undefined,
          undefined,
          undefined,
          true
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
        __heading_2: new FormHeadingComponent('Weiteres'),
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
        __heading_3: new FormHeadingComponent('Klassifizierung'),
        rwstatus: this.rwstatusSelect,
        relationship: this.relationshipSelect,
        categories: this.categoriesInput,
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

  public async getDetail(): Promise<string> {
    const mobilePhones: Phonenumber[] = []
    const phones: Phonenumber[] = []
    this.phonenumbers.map((p: Phonenumber) => {
      if (p.line && p.line.uniquename === 'mobile') {
        mobilePhones.push(p)
      } else {
        phones.push(p)
      }
    })

    //const employees: Contact[] = await this.getEmployees()

    /*
      ${`<p class="text-flex${
        !this.contact_person ? ' none' : ''
      }"><span>Kontaktperson</span><span>${
        this.contact_person
          ? `${this.contact_person}<a class="iconlink" data-navigate="crm/detail/contact/${this.contact_person.id}"><i class="fa fa-external-link-alt"></i></a>`
          : '-'
      }</span></p>`}

      <div class="flex-item">
        <div class="container">
          ${
            employees && employees.length
              ? `<h4>Angestellte</h4><div class="employee-wrap">
              ${employees
                .map((employee) => {
                  return `<p>${employee.givenname ? employee.givenname : ''} ${
                    employee.surname ? employee.surname : ''
                  }<a class="iconlink" data-navigate="crm/detail/contact/${
                    employee.id
                  }"><i class="fa fa-external-link-alt"></i></a></p>`
                })
                .join('')}</div>`
              : '<h4 class="none">Angestellte</h4><p class="none">Keine Angestellte erfasst</p>'
          }
        </div>
      </div>

    */

    return `
    <div class="container">
    <div class="flex">
      <div class="flex-item">
        <h4>Informationen</h4>   
        ${`<p class="text-flex${
          !this.name ? ' none' : ''
        }"><span>Name</span><span>${this.name ? this.name : '-'}</span></p>`}
        <br />
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
            : '<h4 class="none">Websites</h4><p class="none">Keine Websites</p>'
        }
        </div>
        <div class="flex-item">
          <h4></h4>   
          ${
            this.remarks
              ? `
            <h4>Bemerkungen</h4>
            <p class="remark">${this.remarks.split('\n').join('<br />')}</p>
            `
              : '<h4 class="none">Bemerkungen</h4><p class="none remark"></p>'
          }
          ${
            !!this.rwstatus || !!this.relationship || !!this.categories.length
              ? '<h4>Kategorisierung</h4>'
              : '<h4 class="none">Kategorisierung</h4>'
          }
          ${`<p class="text-flex${
            !this.rwstatus ? ' none' : ''
          }"><span>RW-Status</span><span>${
            this.rwstatus ? this.rwstatus.label : '-'
          }</span></p>`}
          ${`<p class="text-flex${
            !this.relationship ? ' none' : ''
          }"><span>Beziehung</span><span>${
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
                  )}<a href="https://www.google.com/maps?q=${
                    this.name
                  }, ${address.toString(
                    ', '
                  )}" target="_blank" rel="noopener" class="map"><i class="fa fa-map-marked-alt"></i></a></p>`
                })
                .join('<br />')}
              `
              : '<h4 class="none">Adressen</h4><p class="none">Keine Adressen</p>'
          }
        </div>
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
                : '<h4 class="none">Mobilnummern</h4><p class="none">Keine Nummern</p>'
            }
            ${
              phones && phones.length
                ? `
                <h4>Nummern</h4>
                ${phones
                  .filter((p) => {
                    return !!p
                  })
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Geschäftsnummern</h4><p class="none">Keine Nummern</p>'
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              this.emails && this.emails.length
                ? `
                <h4>E-Mail Adressen</h4>
                ${this.emails
                  .filter((p) => {
                    return !!p
                  })
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}"><i class="linkicon far fa-envelope"></i>${e.address}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Geschäftliche E-Mail Adressen</h4><p class="none">Keine E-Mail-Adressen</p>'
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
                : '<h4 class="none">Soziale Medien</h4><p class="none">Kein Profile</p>'
            }
          </div>
        </div>
      </div>
    `
  }

  public static async getSelectMap(): Promise<Map<string, any>> {
    const companies = (await DataService.getData('data/company')) as Company[]
    const ret: Map<string, any> = new Map()
    for (const raw of companies as ICompany[]) {
      const entry = ObjectFactory.create<Company>('Company', raw)
      ret[entry.id] = { realValue: entry, value: entry.toString() }
    }
    return ret
  }
}
