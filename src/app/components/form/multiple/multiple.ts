import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import HorizontalWrapperComponent from '../horizontal-wrapper/horizontal-wrapper'
import InputTextComponent, { EInputType } from '../input-text/input-text'
import InputMultipleItemComponent from './multiple-item/multiple-item'
import tmpl from './multiple.html'

export default class InputMultipleComponent extends BaseComponent {
  container: HTMLDivElement = this.querySelector('.container')
  addButton: ButtonComponent = this.querySelector('.add')

  change: (value: any[]) => void
  values: any[]
  initializer: () => any
  isHorizontal: boolean

  constructor(
    change: (value: any[]) => void,
    values: any[] = [],
    initializer: () => any,
    isHorizontal?: boolean
  ) {
    super(tmpl)

    this.change = change
    this.values = values
    this.initializer = initializer
    this.isHorizontal = isHorizontal

    if (values && values.length) {
      this.construct()
    } else {
      this.handleEmpty()
    }

    this.addButton.addEventListener('button-click', () => this.add())
  }

  private add() {
    this.values.push(this.initializer())
    this.change(this.values)
    this.construct()
  }

  private rem(value: any) {
    this.values.splice(this.values.indexOf(value), 1)
    this.change(this.values)
    this.construct()
    if (!this.values.length) {
      this.handleEmpty()
    }
  }

  private handleEmpty() {
    this.classList.add('empty')
    const button = new ButtonComponent('Neuer Eintrag', 'fa fa-plus')
    button.addEventListener('button-click', (e) => {
      this.classList.remove('empty')
      button.parentNode.removeChild(button)
      this.add()
    })
    this.container.appendChild(button)
  }

  private construct() {
    this.container.innerHTML = ''
    this.values.forEach(async (value, index) => {
      let field
      if (value.getField) {
        field = await value.getField(undefined, (newValue: any) => {
          this.values[index] = newValue
          this.change(this.values)
        })
      } else {
        field = new InputTextComponent(
          (newValue: any) => {
            this.values[index] = newValue
            this.change(this.values)
          },
          EInputType.TEXT,
          value
        )
      }
      if (this.isHorizontal) {
        const item = new InputMultipleItemComponent(
          new HorizontalWrapperComponent(field)
        )
        item.addEventListener('remove', () => this.rem(value))
        this.container.appendChild(item)
      } else {
        const item = new InputMultipleItemComponent(field)
        item.addEventListener('remove', () => this.rem(value))
        this.container.appendChild(item)
      }
    })
  }
}
