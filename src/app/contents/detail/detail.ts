import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ContentHeaderComponent from '~/components/content-header/content-header'
import ModalComponent from '~/components/modal/modal'
import {
  DataService,
  EToastType,
  HttpService,
  ObjectFactory,
  Router,
  TitleService,
  ToastService,
} from '~/internal'

import tmpl from './detail.html'

export default class DetailContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )
  content: HTMLDivElement = this.querySelector('.detail-container')

  db: string
  table: string
  identifier: string

  constructor() {
    super(tmpl)

    const params: string[] = Router.getParams()

    if (!params || !params[0] || !params[1]) {
      Router.navigate('crm/404')
      return
    } else {
      this.table = params[0]
      this.id = params[1]
      this.init()
    }

    const datamodel = DataService.getDatamodel(this.table)
    this.db = datamodel.__meta.db
    this.contentHeader.setAttribute('title', `${datamodel.__meta.title} Detail`)
    this.contentHeader.setAttribute('icon', datamodel.__meta.icon)

    TitleService.setTitle(`${datamodel.__meta.title} Detail`)

    const backButton = new ButtonComponent('Zurück', 'fa fa-arrow-left')
    const editButton = new ButtonComponent('Bearbeiten', 'fa fa-pen')
    const trashButton = new ButtonComponent(
      undefined,
      'fa fa-trash',
      'negative'
    )

    this.contentHeader.addButtons(backButton, editButton, trashButton)

    backButton.addEventListener('button-click', (e: MouseEvent) => {
      Router.navigate(`crm/list/${this.table}`, 'crm', e)
    })

    editButton.addEventListener('button-click', (e: MouseEvent) => {
      Router.navigate(`crm/edit/${this.table}/${this.id}`, 'crm', e)
    })

    trashButton.addEventListener('button-click', async () => {
      const modal = new ModalComponent(
        new ConfirmationComponent(
          'Möchtest du diesen Eintrag wirklich löschen? Das kann nicht rückgängig gemacht werden.',
          [
            {
              title: 'Ja, löschen',
              color: 'negative',
              click: async () => {
                HttpService.clearCache()
                modal.close()
                await this.trash()
              },
            },
            {
              title: 'Abbrechen',
              color: 'neutral',
              click: () => {
                modal.close()
              },
            },
          ]
        ),
        undefined,
        undefined,
        true
      )
    })
  }

  private async init() {
    const datamodel = DataService.getDatamodel(this.table)
    this.db = datamodel.__meta.db

    const data = await DataService.getData(
      `${this.db}/${this.table}/${this.id}`
    )

    const obj = ObjectFactory.createFromName(datamodel.__meta.name, data) as any

    if (obj.getDetail) {
      this.content.innerHTML = await obj.getDetail()
    } else {
      this.content.innerHTML = `<p>Ups, hier gibts leider keine Detailseite. Hast du den richtigen Link?</p>`
    }

    this.content
      .querySelectorAll('[data-navigate]')
      .forEach((navigateLink: HTMLAnchorElement) => {
        navigateLink.addEventListener('click', (e) => {
          Router.navigate(navigateLink.dataset.navigate, 'crm', e)
        })
      })
  }

  private async trash() {
    const result: IRestResult = await DataService.removeData(
      `${this.db}/${this.table}/${this.id}`
    )
    if (result.success) {
      Router.navigate(`crm/list/${this.table}`, 'crm')
      ToastService.add(
        'Der Eintrag wurde erfolgreich gelöscht.',
        EToastType.POSITIVE,
        5000
      )
    } else {
      ToastService.add(
        `Der Eintrag konnte nicht gelöscht werden. \n\n${result.errorMessage}`,
        EToastType.NEGATIVE,
        20000
      )
    }
  }
}
