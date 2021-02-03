import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ContentHeaderComponent from '~/components/content-header/content-header'
import FieldComponent from '~/components/form/field/field'
import ModalComponent from '~/components/modal/modal'
import {
  DataService,
  EToastType,
  HttpService,
  ObjectFactory,
  Router,
  SessionService,
  TitleService,
  ToastService,
} from '~/internal'
import md5 from 'md5'

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

  constructor(isInModal = false, p?: string[], onSave?: (value: any) => void) {
    super(tmpl)

    let params: any[] = Router.getParams()
    if (isInModal) {
      params = p
    }
    if (!params || !params[0]) {
      Router.navigate('crm/404')
      return
    }
    if (params[0]) {
      this.table = params[0]
    }
    if (params[1]) {
      this.id = params[1]
    }

    const datamodel = DataService.getDatamodel(this.table)

    this.db = datamodel.__meta.db

    this.contentHeader.setAttribute(
      'title',
      `${datamodel.__meta.title} ${params[1] ? 'bearbeiten' : 'anlegen'}`
    )
    this.contentHeader.setAttribute('icon', datamodel.__meta.icon)

    TitleService.setTitle(datamodel.__meta.titlePlural)

    let backButton
    let rocketButton
    let trashButton
    if (!isInModal) {
      backButton = new ButtonComponent('Zurück', 'fa fa-arrow-left')
      rocketButton = new ButtonComponent(undefined, 'fa fa-rocket')
      trashButton = new ButtonComponent(undefined, 'fa fa-trash', 'negative')
    }
    const saveButton = new ButtonComponent(
      'Speichern',
      'fa fa-save',
      'positive'
    )

    if (!isInModal) {
      this.contentHeader.addButtons(backButton)
    }
    this.contentHeader.addButtons(saveButton)
    if (!isInModal) {
      this.contentHeader.addButtons(rocketButton, trashButton)
    }

    if (!isInModal) {
      backButton.addEventListener('button-click', (e) => {
        if (this.__hash !== md5(JSON.stringify(this.obj))) {
          const modal = new ModalComponent(
            new ConfirmationComponent(
              'Möchest du das das Formular wirklich verlassen?\n\n Deine ungespeicherten Änderungen gehen verloren!',
              [
                {
                  title: 'Ja, verlassen',
                  color: 'neutral',
                  click: (e: MouseEvent) => {
                    modal.close()
                    if (this.obj.getDetail && this.id) {
                      Router.navigate(
                        `crm/detail/${this.table}/${this.id}`,
                        'crm',
                        e
                      )
                    } else {
                      Router.navigate(`crm/list/${this.table}`, 'crm', e)
                    }
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
        } else {
          if (this.obj.getDetail && this.id) {
            Router.navigate(`crm/detail/${this.table}/${this.id}`, 'crm', e)
          } else {
            Router.navigate(`crm/list/${this.table}`, 'crm', e)
          }
        }
      })
      rocketButton.addEventListener('button-click', async (e) => {
        const result: any = await this.save()
        if (result.success) {
          Router.navigate(`crm/edit/${this.table}`, 'crm', e)
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
      trashButton.style.display = 'none'
    }
    saveButton.addEventListener('button-click', async (e: MouseEvent) => {
      const result: any = await this.save()
      if (result.success) {
        HttpService.clearCache()
        if (this.isNew) {
          if (!onSave) {
            Router.navigate(
              `crm/edit/${this.table}/${result.obj.getId()}`,
              'crm',
              e
            )
          } else {
            onSave(result.obj)
          }
        } else if (onSave) {
          onSave(result.obj)
        }
      }
    })

    this.loadEntry(this.table, this.id, datamodel, (hasData) => {
      if (hasData && !isInModal) {
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
      Router.navigate('crm/404', 'crm')
    }
    cb(Object.keys(data).length > 0)
    this.obj = ObjectFactory.createFromName(table, data)
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

    // JO ISCH GRUSIG, MER DOCH GLICH
    setTimeout(() => {
      this.__hash = md5(JSON.stringify(this.obj))
    }, 500)
  }

  private async save(): Promise<any> {
    if (this.obj && this.obj.validate()) {
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
        obj = ObjectFactory.createFromName(this.table, result.data)
      } else {
        result = await DataService.patchData(
          `${this.db}/${this.table}/${this.id}`,
          this.cleanObj(this.obj)
        )
        obj = this.obj
      }
      ToastService.remove(toast)
      if (result.success) {
        await SessionService.refresh()

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
