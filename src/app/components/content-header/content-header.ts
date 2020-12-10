import BaseComponent from '~/baseComponent'
import ButtonComponent from '../button/button'
import tmpl from './content-header.html'

export default class ContentHeaderComponent extends BaseComponent {
  titleElement: HTMLHeadElement = this.querySelector('h3 span')
  icon: HTMLElement = this.querySelector('h3 i')
  buttons: HTMLDivElement = this.querySelector('.buttons')

  static get observedAttributes(): string[] {
    return ['title', 'icon']
  }

  constructor() {
    super(tmpl)
  }

  public addButtons(...buttons: ButtonComponent[]) {
    buttons.forEach((button) => {
      this.buttons.appendChild(button)
    })
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'title') {
      this.titleElement.innerText = newValue
    }
    if (name === 'icon') {
      newValue.split(' ').forEach((c) => {
        this.icon.classList.add(c)
      })
      this.icon.removeAttribute('style')
    }
  }
}
