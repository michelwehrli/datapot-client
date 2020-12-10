import BaseComponent from '~/baseComponent'
import tmpl from './input-text.html'

export default class InputTextComponent extends BaseComponent {
  input: HTMLInputElement

  static get observedAttributes(): string[] {
    return ['type', 'value', 'placeholder']
  }

  constructor(
    changed?: (value: string) => void,
    type: EInputType = EInputType.TEXT,
    value?: string,
    placeholder?: string,
    required?: boolean,
    additionals?: any
  ) {
    super(tmpl)

    this.input = this.querySelector('input')

    if (type) {
      this.input.type = type
    }
    if (value) {
      this.input.value = value
    }
    if (placeholder) {
      this.input.placeholder = placeholder
    }
    if (required) {
      this.classList.add('required')
    }
    if (changed) {
      this.input.addEventListener('keyup', () => changed(this.input.value))
      this.input.addEventListener('change', () => changed(this.input.value))
    }
    for (const additional in additionals) {
      this.input.setAttribute(additional, additionals[additional])
    }
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string,
    newValue: string
  ): void {
    if (attrName === 'type') {
      this.input.type = newValue
    }
    if (attrName === 'value') {
      this.input.value = newValue
    }
    if (attrName === 'placeholder') {
      this.input.placeholder = newValue
    }
  }

  getValue() {
    return this.input.value
  }
}

export enum EInputType {
  'TEXT' = 'text',
  'NUMBER' = 'number',
  'PASSWORD' = 'password',
}
