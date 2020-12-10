import BaseComponent from '~/baseComponent'
import tmpl from './submit-button.html'

export default class SubmitButtonComponent extends BaseComponent {
  submit: HTMLInputElement

  constructor() {
    super(tmpl)

    this.submit = <HTMLInputElement>this.querySelector('input')

    if (this.hasAttribute('text')) {
      this.submit.value = this.getAttribute('text')
    }
    if (this.hasAttribute('classes')) {
      this.getAttribute('classes')
        .split(' ')
        .forEach((className) => {
          this.submit.classList.add(className)
        })
    }
  }
}
