import BaseComponent from '~/baseComponent'
import tmpl from './button.html'

export default class ButtonComponent extends BaseComponent {
  button: HTMLButtonElement
  i: HTMLElement
  span: HTMLSpanElement

  static get observedAttributes(): string[] {
    return ['text', 'icon', 'classes', 'disabled']
  }

  constructor(
    text?: string,
    icon?: string,
    classes?: string,
    disabled?: boolean
  ) {
    super(tmpl)

    this.button = this.querySelector('button')
    this.i = this.button.querySelector('i')
    this.span = this.button.querySelector('span')

    if (!this.hasAttribute('text')) {
      this.span.innerHTML = '&nbsp;'
      this.span.classList.add('empty')
    }

    if (text) {
      this.setAttribute('text', text)
    }
    if (icon) {
      this.setAttribute('icon', icon)
    }
    if (disabled) {
      this.setAttribute('disabled', disabled.toString())
    }
    if (classes) {
      this.setAttribute('classes', classes)
    }

    this.button.addEventListener('click', () => {
      this.dispatchEvent(new Event('button-click'))
    })
  }

  getButton() {
    return this.button
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'text') {
      this.span.innerText = this.getAttribute('text')
      this.span.removeAttribute('style')
      this.span.classList.remove('empty')
    }
    if (name === 'icon') {
      if (oldValue) {
        oldValue.split(' ').forEach((className) => {
          this.i.classList.remove(className)
        })
      }
      newValue.split(' ').forEach((className) => {
        this.i.classList.add(className)
      })
      if (newValue) {
        this.i.removeAttribute('style')
      }
    }
    if (name === 'disabled') {
      this.button.disabled = newValue === 'true'
    }
    if (name === 'classes') {
      newValue.split(' ').forEach((className) => {
        this.button.classList.add(className)
      })
    }
  }
}
