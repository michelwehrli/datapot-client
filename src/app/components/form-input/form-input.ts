import BaseComponent from '~/baseComponent'
import tmpl from './form-input.html'

export default class FormInputComponent extends BaseComponent {
  label: HTMLLabelElement
  input: HTMLInputElement

  constructor() {
    super(tmpl)

    this.label = <HTMLLabelElement>this.querySelector('label')
    this.input = <HTMLInputElement>this.querySelector('input')

    if (this.hasAttribute('label')) {
      this.label.innerText = this.getAttribute('label')
    }
    if (this.hasAttribute('value')) {
      this.input.value = this.getAttribute('value')
    }
    if (this.hasAttribute('type')) {
      this.input.type = this.getAttribute('type')
    }
  }
}
