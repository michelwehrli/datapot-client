import BaseComponent from '~/baseComponent'
import tmpl from './input-textarea.html'

export default class InputTextareaComponent extends BaseComponent {
  textarea: HTMLTextAreaElement

  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'length']
  }

  constructor(
    changed: (value: string) => void,
    value?: string,
    placeholder?: string,
    length?: number
  ) {
    super(tmpl)

    this.textarea = this.querySelector('textarea')

    if (value) {
      this.textarea.value = value
    }
    if (placeholder) {
      this.textarea.placeholder = placeholder
    }
    if (length) {
      this.textarea.rows = length
    }

    this.textarea.addEventListener('keyup', () => changed(this.textarea.value))
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string,
    newValue: string
  ): void {
    if (attrName === 'value') {
      this.textarea.value = newValue
    }
    if (attrName === 'placeholder') {
      this.textarea.placeholder = newValue
    }
    if (attrName === 'length') {
      this.textarea.rows = parseInt(newValue)
    }
  }

  public focus(): void {
    this.textarea.focus()
  }

  getValue(): string {
    return this.textarea.value
  }
}

export enum EInputType {
  'TEXT' = 'text',
  'NUMBER' = 'number',
  'PASSWORD' = 'password',
}
