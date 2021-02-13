import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'

import tmpl from './input-select.html'

export default class InputSelectComponent extends BaseComponent {
  select: HTMLSelectElement = this.querySelector('select')
  addButton: ButtonComponent = this.querySelector('dp-button.add')
  viewButton: ButtonComponent = this.querySelector('dp-button.view')

  private lookup: Map<any, any> = new Map()

  static get observedAttributes(): string[] {
    return ['value', 'placeholder']
  }

  constructor(
    changed: (value) => void,
    values?: any[],
    value?: string | number,
    required?: boolean,
    addButtonFunction?: () => void,
    disabled = false,
    viewFunction?: () => void
  ) {
    super(tmpl)

    if (value) {
      this.select.value = value.toString()
    }
    if (required) {
      this.classList.add('required')
    }

    this.select.addEventListener('change', () => {
      if (this.lookup[this.select.value]) {
        changed(this.lookup[this.select.value])
      } else {
        changed(this.select.value)
      }
    })

    this.populate(values, value)

    if (addButtonFunction) {
      this.addButton.classList.add('visible')
      this.addButton.addEventListener('button-click', () => addButtonFunction())
      this.viewButton.addEventListener('button-click', () => viewFunction())
    }

    if (disabled) {
      this.select.disabled = true
    }
  }

  public toggleViewButton(visible = false): void {
    this.viewButton.classList.toggle('visible', visible)
  }

  public update(values: any[], value: string | number): void {
    this.populate(values, value)
  }

  public focus(): void {
    this.select.focus()
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string,
    newValue: string
  ): void {
    if (attrName === 'value') {
      this.select.value = newValue
    }
  }

  setValues(values: any[], value?: string | number): void {
    this.populate(values, value)
  }

  getValue(): string {
    return this.select.value
  }

  private populate(values: any[], value: string | number) {
    this.select.innerHTML = ''

    const option: HTMLOptionElement = document.createElement('option')
    option.innerText = '-- Bitte wählen --'
    option.value = ''
    this.select.appendChild(option)

    for (const iter of values) {
      const option: HTMLOptionElement = document.createElement('option')
      option.value = iter.key
      if (iter && iter.realValue) {
        this.lookup[iter.key] = iter.realValue
        option.innerText = iter.value
      } else {
        option.innerText = iter
      }
      if (value == iter.key) {
        option.selected = true
      }
      this.select.appendChild(option)
    }
  }
}
