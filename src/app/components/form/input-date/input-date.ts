import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import DatepickerComponent from '~/components/datepicker/datepicker'
import tmpl from './input-date.html'

export default class InputDateComponent extends BaseComponent {
  input: HTMLInputElement = this.querySelector('input')
  picker: DatepickerComponent = this.querySelector('dp-datepicker')
  currentDate: Date
  button: ButtonComponent = this.querySelector('dp-button')

  static get observedAttributes(): string[] {
    return ['date', 'placeholder']
  }

  constructor(
    changed: (value: number) => void,
    date?: number,
    placeholder?: string
  ) {
    super(tmpl)

    this.input.addEventListener('blur', () => {
      const dateString = this.input.value
      const parsedParts = dateString.split('.')
      this.currentDate = new Date(
        `${parsedParts[1]}.${parsedParts[0]}.${parsedParts[2]}`
      )
      this.classList.toggle('error', isNaN(this.currentDate.getTime()))
      if (!isNaN(this.currentDate.getTime())) {
        this.input.value = this.currentDate.toLocaleDateString('de-CH', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        changed(this.currentDate.getTime())
      }
    })
    this.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    document.addEventListener('click', (e) => {
      this.classList.remove('active')
    })

    this.button.addEventListener('button-click', () => {
      this.classList.toggle('active')
    })

    this.picker.addEventListener('changed', () => {
      this.currentDate = this.picker.getValue()
      this.input.value = this.currentDate.toLocaleDateString('de-CH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      changed(this.currentDate.getTime())
      this.classList.remove('active')
    })

    if (date) {
      this.currentDate = new Date(date)
      this.input.value = this.currentDate.toLocaleDateString('de-CH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      this.picker.setAttribute('date', date.toString())
    }
    if (placeholder) {
      this.input.placeholder = placeholder
    }
  }

  public focus(): void {
    this.input.focus()
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string,
    newValue: string
  ): void {
    if (attrName === 'date') {
      this.input.type = newValue
    }
    if (attrName === 'placeholder') {
      this.input.placeholder = newValue
    }
  }

  getValue(): Date {
    return this.currentDate
  }
}
