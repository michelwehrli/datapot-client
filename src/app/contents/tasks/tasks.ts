import BaseComponent from '~/baseComponent'
import ContentHeaderComponent from '~/components/content-header/content-header'
import { TaskService, TitleService } from '~/internal'

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

    TaskService.setTbody(this.tbodyE)
  }
}
