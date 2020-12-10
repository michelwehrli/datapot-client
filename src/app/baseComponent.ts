export default class BaseComponent extends HTMLElement {
  template: HTMLTemplateElement

  connectedCallback(): void {
    this.appendChild(this.template.content.cloneNode(true))
  }

  constructor(tmpl: string) {
    super()
    this.template = document.createElement('template')
    this.innerHTML = tmpl
  }
}
