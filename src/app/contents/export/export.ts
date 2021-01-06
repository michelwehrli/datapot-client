import BaseComponent from '~/baseComponent'
import ContentHeaderComponent from '~/components/content-header/content-header'
import ExportService, { IExportObject } from '~/services/ExportService'
import TitleService from '~/services/TitleService'

import tmpl from './export.html'

export default class ExportContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )
  tbodyE: HTMLElement = this.querySelector('[data-element=tbody]')

  constructor() {
    super(tmpl)

    this.contentHeader.setAttribute('title', 'Export')
    this.contentHeader.setAttribute('icon', 'fa fa-file-export')
    TitleService.setTitle('Export')

    ExportService.setTbody(this.tbodyE)
  }
}
