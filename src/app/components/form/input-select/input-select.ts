import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import tmpl from './input-select.html'

export default class InputSelectComponent extends BaseComponent {
  select: HTMLSelectElement = this.querySelector('select')
  button: ButtonComponent = this.querySelector('dp-button')

  private lookup: Map<any, any> = new Map()

  static get observedAttributes(): string[] {
    return ['value', 'placeholder']
  }

  constructor(
    changed: (value) => void,
    values?: Map<string | number, string>,
    value?: string | number,
    required?: boolean,
    addButtonFunction?: () => void,
    disabled = false
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

    this.popuplate(values, value)

    if (addButtonFunction) {
      this.button.classList.add('visible')
      this.button.addEventListener('button-click', () => addButtonFunction())
    }

    if (disabled) {
      this.select.disabled = true
    }
  }

  public update(
    values: Map<string | number, string>,
    value: string | number
  ): void {
    this.popuplate(values, value)
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

  setValues(values: Map<string | number, any>, value?: string | number): void {
    this.popuplate(values, value)
  }

  getValue(): string {
    return this.select.value
  }

  private popuplate(values, value) {
    this.select.innerHTML = ''

    const option: HTMLOptionElement = document.createElement('option')
    option.innerText = '-- Bitte wählen --'
    this.select.appendChild(option)

    Object.keys(values).forEach((key) => {
      const entryValue = values[key]
      const option: HTMLOptionElement = document.createElement('option')
      option.value = key
      if (entryValue && entryValue.realValue) {
        this.lookup[key] = entryValue.realValue
        option.innerText = entryValue.value
      } else {
        option.innerText = entryValue
      }
      if (value == key) {
        option.selected = true
      }
      this.select.appendChild(option)
    })
  }
}
