import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ContentHeaderComponent from '~/components/content-header/content-header'
import InputMultipleComponent from '~/components/form/multiple/multiple'
import IContact from '~/interfaces/data/IContact'
import {
  EToastType,
  ObjectFactory,
  TitleService,
  ToastService,
} from '~/internal'
import { Contact } from '~/model/data/Contact'
import { Email } from '~/model/data/Email'
import { DataService } from '~/services/DataSessionService'
import { Router } from '~/services/Router'

import tmpl from './email-reviewer.html'

export default class EmailReviewerContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )
  alphabetE: HTMLDivElement = this.querySelector('.alphabet')
  tbodyE: HTMLElement = this.querySelector('[data-element=tbody]')

  changedContacts: Contact[] = []

  saveButton: ButtonComponent

  constructor() {
    super(tmpl)

    this.contentHeader.setAttribute('title', 'E-Mail Reviewer')
    this.contentHeader.setAttribute('icon', 'fa fa-binoculars')
    TitleService.setTitle('E-Mail Reviewer')

    this.saveButton = new ButtonComponent(
      'Alle speichern',
      'fa fa-save',
      'positive',
      true
    )
    this.contentHeader.addButtons(this.saveButton)
    this.saveButton.addEventListener('button-click', async () => {
      const errored: Contact[] = []
      for (const changedContact of this.changedContacts) {
        const result = await DataService.patchData(
          `data/contact/${changedContact.id}`,
          this.cleanObj(changedContact)
        )
        if (!result?.success) {
          errored.push(changedContact)
        }
      }

      if (errored.length) {
        ToastService.add(
          `Da hat was nicht funktioniert. Bitte versuche es erneut.\nFolgende Kontakte konnten nicht gespeichert werden: \n\n${errored
            .map((c) => {
              return `${c.surname}${c.givenname ? ` ${c.givenname}` : ''}`
            })
            .join('\n')}`,
          EToastType.NEGATIVE,
          4000
        )
      } else {
        ToastService.add('Erfolgreich gespeichert!', EToastType.POSITIVE, 2000)
      }
      this.changedContacts = []
      this.saveButton.setAttribute('disabled', 'false')
    })

    const currentLetter = (Router.getParams() && Router.getParams()[0]) || 'a'

    for (const letter of 'abcdefghijklmnopqrstuvwxyzäöü'.split('')) {
      const btn = new ButtonComponent(
        letter.toUpperCase(),
        undefined,
        currentLetter === letter ? 'accent' : undefined
      )
      btn.addEventListener('button-click', () => {
        Router.navigate(`crm/email-reviewer/${letter}`, 'crm')
      })
      this.alphabetE.appendChild(btn)
    }

    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = 3
    const p = document.createElement('p')
    p.innerText = `Lädt Kontakte...`
    td.appendChild(p)
    tr.appendChild(td)
    this.tbodyE.appendChild(tr)

    setTimeout(() => {
      this.populate(currentLetter)
    }, 0)
  }

  private async populate(letter: string) {
    this.tbodyE.innerHTML = ''

    const fragment = document.createDocumentFragment()

    const rawContacts = (await DataService.getData<IContact>(
      'data/contact'
    )) as IContact[]

    const contacts = rawContacts
      .map((c) => {
        return ObjectFactory.create<Contact>('Contact', c)
      })
      .filter((c) => {
        return c.surname.toLowerCase().startsWith(letter)
      })

    for (const contact of contacts) {
      fragment.appendChild(this.getRow(contact))
    }

    if (!contacts.length) {
      const tr = document.createElement('tr')
      const td = document.createElement('td')
      td.colSpan = 3
      const p = document.createElement('p')
      p.innerHTML = `Keine Kontakte die mit "${letter}" starten.`
      td.appendChild(p)
      tr.appendChild(td)
      fragment.appendChild(tr)
    }

    this.tbodyE.appendChild(fragment)
  }

  private getRow(contact: Contact): HTMLTableRowElement {
    const tr = document.createElement('tr')

    const td1 = document.createElement('td')
    const p = document.createElement('p')
    p.innerHTML = `${contact.surname}${
      contact.givenname ? ` ${contact.givenname}` : ''
    }`
    td1.appendChild(p)

    const td2 = document.createElement('td')

    const titleP = document.createElement('strong')
    titleP.innerText = 'Privat'
    td2.appendChild(titleP)

    td2.appendChild(
      new InputMultipleComponent(
        (value: Email[]) => {
          this.pushContact(contact)
          contact.emails = value
        },
        contact.emails,
        () => ObjectFactory.create<Email>('Email'),
        true,
        true
      )
    )

    for (const cwl of contact?.companiesWithLocation) {
      if (cwl?.company?.emails && cwl?.company?.emails.length) {
        const titleP = document.createElement('strong')
        titleP.innerText = cwl.company.name
        td2.appendChild(titleP)

        td2.appendChild(
          new InputMultipleComponent(
            (value: Email[]) => {
              this.pushContact(contact)
              cwl.company.emails = value
            },
            cwl.company.emails,
            () => ObjectFactory.create<Email>('Email'),
            true,
            true
          )
        )
      }
    }

    tr.appendChild(td1)
    tr.appendChild(td2)
    return tr
  }

  private pushContact(contact: Contact) {
    if (this.changedContacts.indexOf(contact) === -1) {
      this.changedContacts.push(contact)
      this.saveButton.setAttribute('disabled', 'false')
    }
  }

  private cleanObj(obj: any) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName]
      }
    }
    return obj
  }
}
