import BaseComponent from '~/baseComponent'
import { ETypeMatch } from '~/enums/ETypeMatch'
import ListTemplate from '~/model/ListTemplate'
import DataService from '~/services/DataService'
import { Router } from '~/services/Router'

import ButtonComponent from '../button/button'
import ConfirmationComponent from '../confirmation/confirmation'
import InputCheckboxComponent from '../form/input-checkbox/input-checkbox'
import InputDateComponent from '../form/input-date/input-date'
import InputTextComponent, { EInputType } from '../form/input-text/input-text'
import ModalComponent from '../modal/modal'
import tmpl from './list.html'

export default class ListComponent extends BaseComponent {
  listContent: HTMLElement = this.querySelector('.list-content')
  tableHeaderTop: HTMLElement = this.querySelector('.js-table-header-top')
  tableHeaderBottom: HTMLElement = this.querySelector('.js-table-header-bottom')
  tableBody: HTMLElement = this.querySelector('.js-table-body')
  count: HTMLElement = this.querySelector('.js-count')
  resetButton: ButtonComponent = this.querySelector('.js-reset')

  fieldsButton: ButtonComponent = this.querySelector('.js-fields')
  fieldsModal: HTMLDivElement = this.querySelector('.js-fields-modal')
  templatesButton: ButtonComponent = this.querySelector('.js-templates')
  templatesModal: HTMLDivElement = this.querySelector('.js-templates-modal')
  templatesList: HTMLDivElement = this.templatesModal.querySelector('.js-list')
  templatesAddName: InputTextComponent = this.templatesModal.querySelector(
    '.js-template-name'
  )
  templatesAddButton: ButtonComponent = this.templatesModal.querySelector(
    '.js-template-button'
  )

  filterInputs: any[] = []
  db: string
  table: string
  data: any[] = []
  datamodel: any = {}

  visibleColumns: any = {}
  columns: Map<string, any[]> = new Map()
  filters: Map<string, string> = new Map()
  templates: ListTemplate[] = []
  initialSortOrder: ISortOrder
  currentSortOrder: ISortOrder

  loadingTimeout: NodeJS.Timer

  constructor() {
    super(tmpl)

    if (Router.getParams() && Router.getParams()[0]) {
      this.table = Router.getParams()[0]
      this.datamodel = DataService.getDatamodel(this.table)

      if (!this.datamodel) {
        return
      }

      const config = localStorage.getItem(`list/${this.table}`)
      if (config) {
        const configuration = JSON.parse(config)
        this.filters = configuration.filters
        this.currentSortOrder = configuration.sortOrder
        this.visibleColumns = configuration.columns
        this.templates = configuration.templates
      }

      if (this.datamodel.__meta.sort) {
        this.initialSortOrder = {
          key: this.datamodel.__meta.sort,
          direction: ESortDirection.DOWN,
        }
      }
      if (!this.currentSortOrder) {
        this.currentSortOrder = this.initialSortOrder
      }

      this.db = this.datamodel.__meta.db
      this.datamodel = this.getDatamodelEntries(this.datamodel)

      for (const key in this.datamodel) {
        if (this.visibleColumns[key] === undefined) {
          this.visibleColumns[key] = true
        }
      }

      const asyncFn = async () => {
        const data: any[] = await DataService.getData(
          `${this.db}/${this.table}`
        )
        if (!data) {
          return
        }
        for (const entry of data) {
          this.data.push(new ETypeMatch[this.table](entry))
        }
        this.init()
      }
      asyncFn()
    }

    this.resetButton.addEventListener('button-click', () => {
      this.filters = new Map()
      for (const input of this.filterInputs) {
        input.setAttribute('value', '')
      }
      this.currentSortOrder = this.initialSortOrder
      this.init()
    })

    this.fieldsButton.addEventListener('button-click', (e) => {
      e.stopPropagation()
      this.fieldsModal.classList.toggle('active')
      this.templatesModal.classList.remove('active')
    })
    this.templatesButton.addEventListener('button-click', (e) => {
      e.stopPropagation()
      this.templatesModal.classList.toggle('active')
      this.fieldsModal.classList.remove('active')
    })
    this.fieldsModal.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    this.templatesModal.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    document.addEventListener('click', (e) => {
      if (
        e.target === this.fieldsButton.getButton() ||
        e.target === this.templatesButton.getButton()
      ) {
        return
      }
      this.fieldsModal.classList.remove('active')
      this.templatesModal.classList.remove('active')
    })

    this.templatesAddButton.addEventListener('button-click', () => {
      const value = this.templatesAddName.getValue()
      this.templatesAddName.classList.toggle('error', !value)
      if (value) {
        this.templatesAddName.setAttribute('value', '')
        this.templates.push(
          new ListTemplate(value, {
            visibleColumns: JSON.stringify(this.visibleColumns),
            filters: JSON.stringify(this.filters),
          })
        )
        this.initializeTemplates()
      }
      this.saveConfiguration()
    })
  }

  private async init() {
    this.loadingTimeout = setTimeout(() => {
      this.listContent.classList.add('loading')
    }, 50)

    setTimeout(() => {
      this.buildTableHeader()
      this.initializeFields()
      this.initializeTemplates()

      if (this.data && this.data.length) {
        setTimeout(() => {
          this.handleData(() => {
            clearTimeout(this.loadingTimeout)
            this.listContent.classList.remove('loading')
          })
        }, 0)
      } else {
        clearTimeout(this.loadingTimeout)
        this.listContent.classList.remove('loading')
        this.listContent.classList.add('nothingfound')
      }
    })
  }

  private async handleData(callback?): Promise<any> {
    let data: any[] = this.filter()
    data = this.sort(data)
    this.count.innerText = data.length.toString()
    const fragment: DocumentFragment = document.createDocumentFragment()

    this.saveConfiguration()

    for (const entry of data) {
      const trElement: HTMLElement = document.createElement('tr')

      trElement.addEventListener('click', () => {
        if (entry.getDetail && entry.getDetail()) {
          Router.navigate(
            `${Router.getUrl(['CrmModule', 'DetailContent'])}/${entry.getId()}`,
            'crm'
          )
        } else {
          Router.navigate(
            `${Router.getUrl(['CrmModule', 'EditContent'])}/${entry.getId()}`,
            'crm'
          )
        }
      })

      for (const key in this.datamodel) {
        const fieldModel: any = this.datamodel[key]
        if (fieldModel.isListable !== false && fieldModel.isSecure !== true) {
          const tdElement: HTMLElement = document.createElement('td')
          if (!this.columns[key]) {
            this.columns[key] = []
          }
          this.columns[key].push(tdElement)
          tdElement.classList.toggle('hidden', !this.visibleColumns[key])
          const pElement: HTMLElement = document.createElement('p')
          pElement.innerText = this.getFieldValue(entry, key, fieldModel)
          tdElement.appendChild(pElement)
          trElement.appendChild(tdElement)
        }
      }

      fragment.appendChild(trElement)
    }

    if (!data.length) {
      this.listContent.classList.add('nothingfound')
      clearTimeout(this.loadingTimeout)
      this.listContent.classList.remove('loading')
    } else {
      this.listContent.classList.remove('nothingfound')
    }

    this.tableBody.addEventListener(
      'DOMNodeInserted',
      () => {
        if (callback) {
          callback()
        }
      },
      { once: true, passive: true }
    )

    this.tableBody.innerHTML = ''
    this.tableBody.appendChild(fragment)
  }

  private getFieldValue(entry: any, fieldName: string, model: any): string {
    const values: string[] = []
    if (entry[fieldName] && Array.isArray(entry[fieldName])) {
      for (const item of entry[fieldName]) {
        values.push(item.toString())
      }
    } else if (entry[fieldName]) {
      let value = entry[fieldName].toString()
      if (model.type === 'date') {
        value = new Date(parseInt(value)).toLocaleDateString('de-ch')
      }
      values.push(value)
    } else {
      values.push('')
    }

    return values.join(', ')
  }

  private buildTableHeader() {
    this.tableHeaderTop.innerHTML = ''
    this.tableHeaderBottom.innerHTML = ''

    for (const key in this.datamodel) {
      const model = this.datamodel[key]
      if (model.isListable !== false && model.isSecure !== true) {
        const thElement: HTMLElement = document.createElement('th')
        if (!this.columns[key]) {
          this.columns[key] = []
        }
        this.columns[key].push(thElement)
        thElement.classList.toggle('hidden', !this.visibleColumns[key])
        const innerElement: HTMLDivElement = document.createElement('div')
        innerElement.classList.add('inner')
        const pElement: HTMLParagraphElement = document.createElement('p')
        const sortButton: ButtonComponent = new ButtonComponent(
          undefined,
          this.currentSortOrder &&
          this.currentSortOrder.key === key &&
          this.currentSortOrder.direction === ESortDirection.UP
            ? 'fa fa-sort-alpha-up'
            : 'fa fa-sort-alpha-down',
          `transparent`
        )
        sortButton.classList.add('sort-button')
        if (this.currentSortOrder && this.currentSortOrder.key === key) {
          sortButton.classList.add('active')
        }
        sortButton.addEventListener('button-click', () => {
          if (this.currentSortOrder) {
            if (this.currentSortOrder.direction === ESortDirection.DOWN) {
              this.currentSortOrder = {
                key: key,
                direction: ESortDirection.UP,
              }
            } else {
              this.currentSortOrder = {
                key: key,
                direction: ESortDirection.DOWN,
              }
            }
          } else {
            this.currentSortOrder = { key: key, direction: ESortDirection.UP }
          }
          this.init()
        })
        pElement.innerText = model.label
        innerElement.appendChild(pElement)
        innerElement.appendChild(sortButton)
        thElement.appendChild(innerElement)
        this.tableHeaderTop.appendChild(thElement)

        let element: any

        switch (model.type) {
          case 'number':
            element = new InputTextComponent(
              (value: string) => {
                this.setFilter(key, value)
                this.handleData()
              },
              EInputType.NUMBER,
              this.filters[key]
            )
            break
          case 'date':
            element = new InputDateComponent((value: number) => {
              this.setFilter(key, value)
              this.handleData()
            }, this.filters[key])
            break
          default:
            element = new InputTextComponent(
              (value: string) => {
                this.setFilter(key, value)
                this.handleData()
              },
              undefined,
              this.filters[key]
            )
            break
        }

        this.filterInputs.push(element)

        const thElementBottom: HTMLElement = document.createElement('th')
        if (element) {
          thElementBottom.appendChild(element)
        }
        this.columns[key].push(thElementBottom)
        thElementBottom.classList.toggle('hidden', !this.visibleColumns[key])
        this.tableHeaderBottom.appendChild(thElementBottom)
      }
    }
  }

  private setFilter(name: any, value: string | number) {
    this.filters[name] = value
    if (!value) {
      delete this.filters[name]
    }
  }

  private filter(): any[] {
    if (Object.keys(this.filters).length === 0) {
      return this.data
    }
    return this.data.filter((entry) => {
      let allMatches = true
      for (const key in this.filters) {
        const value = this.filters[key]
        let e = entry[key]
        if (e && Array.isArray(e)) {
          const arr = e
          e = []
          for (const i of arr) {
            e.push(i.toString())
          }
          e = e.join(', ')
        }
        if (allMatches) {
          allMatches =
            e &&
            e.toString() &&
            value &&
            e.toString().toLowerCase().indexOf(value.toLowerCase()) > -1
        }
      }
      return allMatches
    })
  }

  private sort(data: any[]): any[] {
    if (!this.currentSortOrder) {
      return data
    }
    const key = this.currentSortOrder.key
    return data.sort((a, b) => {
      if (this.currentSortOrder.direction === ESortDirection.UP) {
        if (a[key] === b[key]) return 0
        if (!a[key]) return 1
        if (!b[key]) return -1
        return a[key] !== b[key] ? (a[key] < b[key] ? 1 : -1) : 0
      }
      if (this.currentSortOrder.direction === ESortDirection.DOWN) {
        if (a[key] === b[key]) return 0
        if (!a[key]) return -1
        if (!b[key]) return 1
        return a[key] !== b[key] ? (a[key] > b[key] ? 1 : -1) : 0
      }
    })
  }

  private toggleColumn(key: string, visible: boolean): void {
    if (this.columns[key]) {
      for (const item of this.columns[key]) {
        item.classList.toggle('hidden', !visible)
      }
    }
  }

  private initializeFields(): void {
    this.fieldsModal.innerHTML = ''
    for (const key in this.datamodel) {
      const field = this.datamodel[key]
      if (field.isListable !== false && field.isSecure !== true) {
        const checkboxComponent = new InputCheckboxComponent(
          (value: boolean) => {
            this.visibleColumns[key] = value
            this.toggleColumn(key, value)
            this.saveConfiguration()
          },
          this.visibleColumns[key],
          field.label
        )
        this.fieldsModal.appendChild(checkboxComponent)
      }
    }
  }

  private initializeTemplates(): void {
    this.templatesList.innerHTML = ''
    for (const template of this.templates) {
      const div = document.createElement('div')
      div.classList.add('item')
      const p = document.createElement('p')
      p.innerText = template.name
      const applyBtn = new ButtonComponent(undefined, 'fa fa-check', 'positive')
      applyBtn.addEventListener('button-click', () => {
        this.visibleColumns = JSON.parse(template.config.visibleColumns)
        this.filters = JSON.parse(template.config.filters)
        this.initializeFields()
        this.init()
      })
      const removeBtn = new ButtonComponent(
        undefined,
        'fa fa-times',
        'negative'
      )
      removeBtn.addEventListener('button-click', () => {
        const modal = new ModalComponent(
          new ConfirmationComponent(
            'Möchtest du diese Vorlage wirklich löschen? Sie kann nicht wiederhergestellt werden.',
            [
              {
                title: 'Ja, löschen',
                color: 'negative',
                click: () => {
                  modal.close()
                  this.templatesList.removeChild(div)
                  this.templates.splice(this.templates.indexOf(template), 1)
                  this.saveConfiguration()
                },
              },
              {
                title: 'Nein',
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
      div.appendChild(p)
      div.appendChild(applyBtn)
      div.appendChild(removeBtn)
      this.templatesList.appendChild(div)
    }
  }

  private getDatamodelEntries(datamodel) {
    const ret = {}
    for (const key in datamodel) {
      if (key !== '__meta') {
        ret[key] = datamodel[key]
      }
    }
    return ret
  }

  private async saveConfiguration() {
    const config = {
      sortOrder: this.currentSortOrder,
      columns: this.visibleColumns,
      filters: this.filters,
      templates: this.templates,
    }
    localStorage.setItem(`list/${this.table}`, JSON.stringify(config))
  }
}

enum ESortDirection {
  'UP' = 1,
  'DOWN' = 0,
}

interface ISortOrder {
  key: string
  direction: ESortDirection
}
