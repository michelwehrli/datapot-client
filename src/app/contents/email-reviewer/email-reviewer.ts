import BaseComponent from '~/baseComponent'
import ContentHeaderComponent from '~/components/content-header/content-header'
import { TitleService } from '~/internal'

import tmpl from './email-reviewer.html'

export default class EmailReviewerContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )

  constructor() {
    super(tmpl)

    this.contentHeader.setAttribute('title', 'E-Mail Reviewer')
    this.contentHeader.setAttribute('icon', 'fa fa-binoculars')
    TitleService.setTitle('E-Mail Reviewer')
  }
}
