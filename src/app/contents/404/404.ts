import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import { Router } from '~/services/Router'
import tmpl from './404.html'

export default class NotFoundContent extends BaseComponent {
  backButton: ButtonComponent = this.querySelector('dp-button')

  constructor() {
    super(tmpl)

    if (Router.hasHistory()) {
      this.backButton.addEventListener('click', () => {
        Router.back()
      })
    } else {
      this.backButton.style.display = 'none'
    }
  }
}
