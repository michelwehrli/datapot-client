import BaseComponent from '~/baseComponent'
import ContentHeaderComponent from '~/components/content-header/content-header'
import ExportService from '~/services/TaskService'
import TitleService from '~/services/TitleService'

import tmpl from './tasks.html'

export default class TasksContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )
  tbodyE: HTMLElement = this.querySelector('[data-element=tbody]')

  constructor() {
    super(tmpl)

    this.contentHeader.setAttribute('title', 'Tasks')
    this.contentHeader.setAttribute('icon', 'fa fa-cog')
    TitleService.setTitle('Tasks')

    ExportService.setTbody(this.tbodyE)
  }
}
