import md5 from 'md5'
import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ContentHeaderComponent from '~/components/content-header/content-header'
import FieldComponent from '~/components/form/field/field'
import ModalComponent from '~/components/modal/modal'
import { ETypeMatch } from '~/enums/ETypeMatch'
import DataService from '~/services/DataService'
import { Router } from '~/services/Router'
import TitleService from '~/services/TitleService'
import { EToastType, ToastService } from '~/services/ToastService'
import tmpl from './edit.html'

export default class EditContent extends BaseComponent {
  form: HTMLFormElement = this.querySelector('form')
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )

  obj
  isNew: boolean
  db: string
  table: string
  id

  private __hash: string

  constructor() {
    super(tmpl)

    const params: any[] = Router.getParams()
    if (!params || !params[0]) {
      Router.navigate('crm/404')
      return
    }
    this.table = params[0]
    if (params[1]) {
      this.id = params[1]
    }

    const datamodel = DataService.getDatamodel(this.table)

    this.db = datamodel.__meta.db

    this.contentHeader.setAttribute(
      'title',
      `${datamodel.__meta.title} bearbeiten`
    )
    this.contentHeader.setAttribute('icon', datamodel.__meta.icon)

    TitleService.setTitle(datamodel.__meta.titlePlural)

    const backButton = new ButtonComponent('Zurück', 'fa fa-arrow-left')
    const saveButton = new ButtonComponent(
      'Speichern',
      'fa fa-save',
      'positive'
    )
    const rocketButton = new ButtonComponent(undefined, 'fa fa-rocket')
    const trashButton = new ButtonComponent(
      undefined,
      'fa fa-trash',
      'negative'
    )

    this.contentHeader.addButtons(
      backButton,
      saveButton,
      rocketButton,
      trashButton
    )

    backButton.addEventListener('button-click', () => {
      if (this.__hash !== md5(JSON.stringify(this.obj))) {
        const modal = new ModalComponent(
          new ConfirmationComponent(
            'Möchest du das das Formular wirklich verlassen? Deine ungespeicherten Änderungen gehen verloren!',
            [
              {
                title: 'Ja, verlassen',
                color: 'neutral',
                click: () => {
                  modal.close()
                  if (this.obj.getDetail && this.obj.getDetail()) {
                    Router.navigate(
                      `crm/detail/${this.table}/${this.id}`,
                      'crm'
                    )
                  } else {
                    Router.navigate(`crm/list/${this.table}`, 'crm')
                  }
                },
              },
              {
                title: 'Abbrechen',
                color: 'positive',
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
      } else {
        if (this.obj.getDetail && this.obj.getDetail()) {
          Router.navigate(`crm/detail/${this.table}/${this.id}`, 'crm')
        } else {
          Router.navigate(`crm/list/${this.table}`, 'crm')
        }
      }
    })
    saveButton.addEventListener('button-click', async () => {
      const result: any = await this.save()
      if (result.success && this.isNew) {
        Router.navigate(`crm/edit/${this.table}/${result.obj.getId()}`, 'crm')
      }
    })
    rocketButton.addEventListener('button-click', async () => {
      const result: any = await this.save()
      if (result.success) {
        Router.navigate(`crm/edit/${this.table}`, 'crm')
      }
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
    trashButton.style.display = 'none'

    this.loadEntry(this.table, this.id, datamodel, (hasData) => {
      if (hasData) {
        trashButton.style.display = 'block'
      }
      this.isNew = !hasData
    })
  }

  private async loadEntry(
    table: string,
    id,
    datamodel,
    cb: (hasData: boolean) => void
  ): Promise<void> {
    let data = {}
    if (id) {
      data = await DataService.getData(`${this.db}/${table}/${id}`)
    }
    if (!data) {
      Router.navigate('crm/404')
    }
    cb(Object.keys(data).length > 0)
    const type = ETypeMatch[table]
    this.obj = new type(data)
    const fields = await this.obj.getField(true)
    for (const key in fields) {
      const field = fields[key]
      let label = ''
      if (datamodel[key] && datamodel[key].label) {
        label = datamodel[key].label
      }
      if (key.indexOf('__heading') > -1) {
        this.form.appendChild(field)
      } else {
        this.form.appendChild(new FieldComponent(label, field))
      }
    }

    // TODO: does not always work because it happens to early.
    // TODO: wait for all fields to be done with initializing
    this.__hash = md5(JSON.stringify(this.obj))
  }

  private async save(): Promise<any> {
    if (this.obj.validate()) {
      const toast = ToastService.add(
        'Eintrag wird gespeichert...',
        EToastType.INFO
      )
      let result
      let obj
      if (this.isNew) {
        result = await DataService.postData(
          `${this.db}/${this.table}`,
          this.cleanObj(this.obj)
        )
        obj = new ETypeMatch[this.table](result.data)
      } else {
        result = await DataService.patchData(
          `${this.db}/${this.table}/${this.id}`,
          this.cleanObj(this.obj)
        )
        obj = this.obj
      }
      ToastService.remove(toast)
      if (result.success) {
        this.__hash = md5(JSON.stringify(this.obj))
        ToastService.add(
          'Der Eintrag wurde erfolgreich gespeichert.',
          EToastType.POSITIVE,
          5000
        )
        return {
          success: true,
          obj: obj,
        }
      } else {
        ToastService.add(
          `Der Eintrag konnte nicht gespeichert werden. \n${result.errorMessage}`,
          EToastType.NEGATIVE,
          20000
        )
        return {
          success: false,
        }
      }
    } else {
      ToastService.add(
        `Es sind noch nicht alle obligatorischen Felder ausgefüllt.`,
        EToastType.NEGATIVE,
        4000
      )
      return {
        success: false,
      }
    }
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

  private cleanObj(obj: any) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName]
      }
    }
    return obj
  }
}
