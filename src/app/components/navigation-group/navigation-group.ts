import BaseComponent from '~/baseComponent'
import NavigationItemComponent from '../navigation-item/navigation-item'
import tmpl from './navigation-group.html'

export default class NavigationGroupComponent extends BaseComponent {
  text: HTMLParagraphElement
  items: HTMLDivElement

  constructor(title: string) {
    super(tmpl)

    this.text = this.querySelector('p')
    this.items = this.querySelector('.items')

    if (title) {
      this.text.innerText = title
    }
  }

  public addItem(item: NavigationItemComponent): void {
    this.items.appendChild(item)
  }
}
