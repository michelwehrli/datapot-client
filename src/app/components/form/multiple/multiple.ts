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
  initialSelect: HTMLElement

  constructor(
    change: (value: any[]) => void,
    values: any[] = [],
    initializer: () => any,
    isHorizontal?: boolean,
    private dontFocus = false
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

  private rem(index: number) {
    this.values.splice(index, 1)
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
          if (newValue) {
            this.values[index] = newValue
            this.change(this.values)
          } else {
            this.rem(index)
          }
        })
        if (!this.initialSelect) {
          this.initialSelect = Object.values(field)[0] as HTMLElement
        }
      } else {
        field = new InputTextComponent(
          (newValue: any) => {
            if (newValue) {
              this.values[index] = newValue
              this.change(this.values)
            } else {
              this.rem(index)
            }
          },
          EInputType.TEXT,
          value
        )
        if (!this.initialSelect) {
          this.initialSelect = field
        }
      }

      if (this.initialSelect && !this.dontFocus) {
        this.initialSelect.focus()
      }

      let item
      if (this.isHorizontal) {
        item = new InputMultipleItemComponent(
          new HorizontalWrapperComponent(field)
        )
      } else {
        item = new InputMultipleItemComponent(field)
      }
      item.addEventListener('remove', () => this.rem(index))
      this.container.appendChild(item)
    })
  }
}
