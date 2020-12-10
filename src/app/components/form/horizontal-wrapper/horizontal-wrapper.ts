import BaseComponent from '~/baseComponent'
import tmpl from './horizontal-wrapper.html'

export default class HorizontalWrapperComponent extends BaseComponent {
  container: HTMLDivElement = this.querySelector('.container')

  constructor(components: any[]) {
    super(tmpl)

    for (const component of Object.values(components)) {
      this.appendChild(component)
    }
  }
}
