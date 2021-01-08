import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import tmpl from './multiple-item.html'

export default class InputMultipleItemComponent extends BaseComponent {
  component: HTMLDivElement = this.querySelector('.component')
  removeButton: ButtonComponent = this.querySelector('.remove')
  sortButton: ButtonComponent = this.querySelector('.sort')

  static get observedAttributes(): string[] {
    return []
  }

  constructor(fragments: any | any[], buttonsHidden?: boolean) {
    super(tmpl)

    if (fragments.constructor.name === 'Object') {
      Object.values(fragments).forEach((fragment: HTMLElement) => {
        this.component.appendChild(fragment)
      })
    } else {
      this.component.appendChild(fragments)
    }

    if (buttonsHidden) {
      /*this.addButton.classList.add('hidden')
      this.sortButton.classList.add('hidden')*/
    }

    this.removeButton.addEventListener('button-click', () => {
      this.dispatchEvent(new Event('remove'))
    })
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string,
    newValue: string
  ): void {
    return
  }
}
