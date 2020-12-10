import BaseComponent from '~/baseComponent'
import tmpl from './navigation-item.html'

export default class NavigationItemComponent extends BaseComponent {
  button: HTMLButtonElement
  span: HTMLSpanElement
  icon: HTMLElement

  static get observedAttributes(): string[] {
    return ['classes', 'active']
  }

  constructor(meta: any) {
    super(tmpl)

    this.button = this.querySelector('button')
    this.span = this.button.querySelector('span')
    this.icon = this.button.querySelector('i')

    if (meta.titlePlural) {
      this.span.innerText = meta.titlePlural
    }
    if (meta.icon) {
      meta.icon.split(' ').forEach((c) => {
        this.icon.classList.add(c)
      })
    }
    if (meta.isMain) {
      this.button.classList.add('big')
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'classes') {
      this.getAttribute('classes')
        .split(' ')
        .forEach((className) => {
          this.button.classList.add(className)
        })
    }
    if (name === 'active') {
      this.button.classList.toggle('accent', newValue === 'true')
    }
  }
}
