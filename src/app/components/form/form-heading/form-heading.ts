import BaseComponent from '~/baseComponent'
import tmpl from './form-heading.html'

export default class FormHeadingComponent extends BaseComponent {
  heading: HTMLDivElement = this.querySelector('h2')

  constructor(text: string) {
    super(tmpl)

    this.heading.innerText = text
  }
}
