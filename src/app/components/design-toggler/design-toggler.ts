import BaseComponent from '~/baseComponent'
import { DesignService, SessionService } from '~/internal'
import tmpl from './design-toggler.html'

export default class DesignTogglerComponent extends BaseComponent {
  toggler: HTMLDivElement = this.querySelector('.toggler')

  static get observedAttributes(): string[] {
    return ['design']
  }

  constructor() {
    super(tmpl)

    if (
      SessionService.user &&
      SessionService.user.design &&
      SessionService.user.design.uniquename === 'dark'
    ) {
      this.toggler.classList.add('dark')
    } else {
      this.toggler.classList.remove('dark')
    }

    this.toggler.addEventListener('click', () => {
      this.toggler.classList.toggle('dark')
      SessionService.setDesign(
        this.toggler.classList.contains('dark') ? 'dark' : 'light'
      )
      DesignService.toggle(
        this.toggler.classList.contains('dark') ? 'dark' : 'light'
      )
    })
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'design') {
      if (newValue === 'dark') {
        this.toggler.classList.add('dark')
      } else {
        this.toggler.classList.remove('dark')
      }
    }
  }
}
