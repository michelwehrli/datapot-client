import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ContentHeaderComponent from '~/components/content-header/content-header'
import ModalComponent from '~/components/modal/modal'
import { ETypeMatch } from '~/enums/ETypeMatch'
import DataService from '~/services/DataService'
import { Router } from '~/services/Router'
import { EToastType, ToastService } from '~/services/ToastService'
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
    } else {
      this.table = params[0]
      this.identifier = params[1]
      this.init()
    }

    const backButton = new ButtonComponent('Zurück', 'fa fa-arrow-left')
    const editButton = new ButtonComponent('Bearbeiten', 'fa fa-pen')
    const trashButton = new ButtonComponent(
      undefined,
      'fa fa-trash',
      'negative'
    )

    this.contentHeader.addButtons(backButton, editButton, trashButton)

    backButton.addEventListener('button-click', () => {
      Router.navigate(`crm/list/${this.table}`)
    })

    editButton.addEventListener('button-click', () => {
      Router.navigate(`crm/edit/${this.table}/${this.identifier}`)
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
      `${this.db}/${this.table}/${this.identifier}`
    )

    const obj = new ETypeMatch[datamodel.__meta.name](data)

    this.content.innerHTML = obj.getDetail()
  }

  private async trash() {
    const result: IRestResult = await DataService.removeData(
      `${this.db}/${this.table}/${this.id}`
    )
    if (result.success) {
      Router.navigate(`crm/list/${this.table}`)
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
