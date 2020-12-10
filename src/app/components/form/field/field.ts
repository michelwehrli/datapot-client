import BaseComponent from '~/baseComponent'
import tmpl from './field.html'

export default class FieldComponent extends BaseComponent {
  label: HTMLLabelElement = this.querySelector('label')
  container: HTMLDivElement = this.querySelector('.container')

  constructor(label: string, component: any) {
    super(tmpl)

    this.label.innerText = label
    this.container.appendChild(component)
  }
}
