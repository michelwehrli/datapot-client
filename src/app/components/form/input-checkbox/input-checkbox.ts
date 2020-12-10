import BaseComponent from '~/baseComponent'
import tmpl from './input-checkbox.html'

export default class InputCheckboxComponent extends BaseComponent {
  input: HTMLInputElement = this.querySelector('input')
  label: HTMLLabelElement = this.querySelector('label')

  static get observedAttributes(): string[] {
    return ['checked', 'text']
  }

  constructor(
    changed: (value: boolean) => void,
    checked = false,
    text?: string,
    isInForm?: boolean
  ) {
    super(tmpl)

    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)

    this.input.setAttribute('id', id)
    this.label.setAttribute('for', id)

    this.input.checked = checked

    if (text) {
      this.label.innerText = text
    } else {
      this.label.style.display = 'none'
    }

    if (isInForm) {
      this.classList.add('in-form')
    }

    this.input.addEventListener('change', () => changed(this.input.checked))
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string,
    newValue: boolean
  ): void {
    if (attrName === 'checked') {
      this.input.checked = newValue
    }
    if (attrName === 'text') {
      return
    }
  }

  getValue(): boolean {
    return this.input.checked
  }
}
