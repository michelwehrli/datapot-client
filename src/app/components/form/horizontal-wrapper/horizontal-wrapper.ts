import BaseComponent from '~/baseComponent'
import tmpl from './horizontal-wrapper.html'

export default class HorizontalWrapperComponent extends BaseComponent {
  container: HTMLDivElement = this.querySelector('.container')

  constructor(private components: any[]) {
    super(tmpl)

    for (const component of Object.values(components)) {
      this.appendChild(component)
    }
  }

  public focus(): void {
    setTimeout(() => this.components[0].focus(), 0)
  }
}
