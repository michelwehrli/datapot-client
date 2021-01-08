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
    this.phonenumbers = []
    if (data.phonenumbers) {
      data.phonenumbers.forEach((phonenumber: IPhonenumber) => {
        this.phonenumbers.push(new Phonenumber(phonenumber))
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

  public toString(reverse = false): string {
    let ret
    if (this.givenname && this.surname) {
      ret = `${this.givenname} ${this.surname}`
    } else if (this.surname) {
      ret = this.surname
    } else if (this.givenname) {
      ret = this.givenname
    }
    if (reverse) {
      return ret.split(' ').reverse().join(' ')
    }
    return ret
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
    for (const phonenumber of this.phonenumbers) {
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

    const genderSelect = new InputSelectComponent(
      (value: Gender) => (this.gender = value),
      await Gender.getSelectMap('data', 'gender'),
      this.gender ? this.gender.uniquename : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(true, ['gender'], async (value: Gender) => {
            genderSelect.update(
              await Gender.getSelectMap('data', 'gender'),
              value.uniquename
            )
            this.gender = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )
    const salutationSelect = new InputSelectComponent(
      (value: Salutation) => (this.salutation = value),
      await Salutation.getSelectMap('data', 'salutation'),
      this.salutation ? this.salutation.uniquename : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(true, ['salutation'], async (value: Salutation) => {
            salutationSelect.update(
              await Salutation.getSelectMap('data', 'salutation'),
              value.uniquename
            )
            this.salutation = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )
    const titleSelect = new InputSelectComponent(
      (value: Title) => (this.title = value),
      await Title.getSelectMap('data', 'title'),
      this.title ? this.title.uniquename : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(true, ['title'], async (value: Title) => {
            titleSelect.update(
              await Title.getSelectMap('data', 'title'),
              value.uniquename
            )
            this.title = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )
      }
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
    const rwstatusSelect = new InputSelectComponent(
      (value: RWStatus) => (this.rwstatus = value),
      await RWStatus.getSelectMap('data', 'rwstatus'),
      this.rwstatus ? this.rwstatus.uniquename : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(true, ['rwstatus'], async (value: RWStatus) => {
            rwstatusSelect.update(
              await RWStatus.getSelectMap('data', 'rwstatus'),
              value.uniquename
            )
            this.rwstatus = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )
    const relationshipSelect = new InputSelectComponent(
      (value: Relationship) => (this.relationship = value),
      await Relationship.getSelectMap('data', 'relationship'),
      this.relationship ? this.relationship.uniquename : undefined,
      undefined,
      () => {
        const modal = new ModalComponent(
          new EditContent(
            true,
            ['relationship'],
            async (value: Relationship) => {
              relationshipSelect.update(
                await Relationship.getSelectMap('data', 'relationship'),
                value.uniquename
              )
              this.relationship = value
              modal.close()
            }
          ),
          undefined,
          undefined,
          undefined,
          true
        )
      }
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
        phonenumbers: new InputMultipleComponent(
          (value: Phonenumber[]) => (this.phonenumbers = value),
          this.phonenumbers,
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
        rwstatus: rwstatusSelect,
        relationship: relationshipSelect,
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
            ${`<p class="text-flex${
              !this.salutation ? ' none' : ''
            }"><span>Anrede</span><span>${
              this.salutation ? this.salutation : '-'
            }</span></p>`}
              
            ${`<p class="text-flex${
              !this.title ? ' none' : ''
            }"><span>Titel</span><span>${
              this.title ? this.title : '-'
            }</span></p>`}
              
            ${`<p class="text-flex${
              !this.givenname ? ' none' : ''
            }"><span>Vorname</span><span>${
              this.givenname ? this.givenname : '-'
            }</span></p>`}
              
            ${`<p class="text-flex${
              !this.additional_names || !this.additional_names.length
                ? ' none'
                : ''
            }"><span></span><span>${
              this.additional_names && this.additional_names.length
                ? this.additional_names.join(' ')
                : '-'
            }</span></p>`}
              
            ${`<p class="text-flex${
              !this.surname ? ' none' : ''
            }"><span>Nachname</span><span>${
              this.surname ? this.surname : '-'
            }</span></p>`}

            ${`<p class="text-flex${
              !this.birthdate ? ' none' : ''
            }"><span>Geburtstag</span><span>${
              this.birthdate
                ? new Date(this.birthdate).toLocaleDateString('ch-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                  })
                : '-'
            }</span></p>`}
            <br />              
            ${`<p class="text-flex${
              !this.partner ? ' none' : ''
            }"><span>Partner/in</span><span>${
              this.partner
                ? `${this.partner.toString()} <a class="iconlink" data-navigate="crm/detail/contact/${
                    this.partner.id
                  }"><i class="fa fa-external-link-alt"></i></a>`
                : '-'
            }</span></p>`}

            ${
              this.websites && this.websites.length
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
            ${`<p class="text-flex${
              !this.department ? ' none' : ''
            }"><span>Abteilung</span><span>${
              this.department ? this.department : '-'
            }</span></p>`}
            ${
              this.remarks
                ? `
              <h4>Bemerkungen</h4>
              <p class="remark">${this.remarks.split('\n').join('<br />')}</p>
              `
                : '<h4 class="none">Bemerkungen</h4><p class="none remark"></p>'
            }
            <h4>Kategorisierung</h4>
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
                  .map((address) => {
                    return `<p>${address.toString(
                      '<br />'
                    )}<a href="https://www.google.com/maps?q=${address.toString(
                      ', '
                    )}" target="_blank" rel="noopener" class="map"><i class="fa fa-map-marked-alt"></i></a></p>`
                  })
                  .join('<br />')}
                `
                : '<h4 class="none">Adressen</h4><p class="none">Keine Adressen</p>'
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
                : '<h4 class="none">Firmen</h4><p class="none">Keine Firmen</p>'
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
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Mobilnummern</h4><p class="none">Keine Nummern</p>'
            }
            ${
              businessPhones && businessPhones.length
                ? `
                <h4>Geschäftsnummern</h4>
                ${businessPhones
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Geschäftsnummern</h4><p class="none">Keine Nummern</p>'
            }
            ${
              homePhones && homePhones.length
                ? `
                <h4>Privatnummern</h4>
                ${homePhones
                  .map((p) => {
                    return `<p><a href="tel:${
                      p.number
                    }"><i class="linkicon fa fa-phone-alt"></i>${p.toString()}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Privatnummern</h4><p class="none">Keine Nummern</p>'
            }
          </div>
        </div>
        <div class="flex-item">
          <div class="container">
            ${
              businessEmail && businessEmail.length
                ? `
                <h4>Geschäftliche E-Mail Adressen</h4>
                ${businessEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}"><i class="linkicon far fa-envelope"></i>${e.address}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Geschäftliche E-Mail Adressen</h4><p class="none">Keine E-Mail-Adressen</p>'
            }
            ${
              privateEmail && privateEmail.length
                ? `
                <h4>Private E-Mail-Adressen</h4>
                ${privateEmail
                  .map((e) => {
                    return `<p><a href="mailto:${e.address}"><i class="linkicon far fa-envelope"></i>${e.address}</a></p>`
                  })
                  .join('')}`
                : '<h4 class="none">Private E-Mail-Adressen</h4><p class="none">Keine E-Mail-Adressen</p>'
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
    const contacts = (await DataService.getData('data/contact')) as Contact[]
    const ret: Map<string, any> = new Map()
    for (const raw of contacts as ICompany[]) {
      const entry = new Contact(raw)
      ret[entry.id] = {
        realValue: entry,
        value: entry.toString(true),
      }
    }
    return ret
  }
}
