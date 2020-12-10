import BaseComponent from '~/baseComponent'
import DatepickerComponent from '~/components/datepicker/datepicker'
import tmpl from './input-date.html'

export default class InputDateComponent extends BaseComponent {
  input: HTMLInputElement = this.querySelector('input')
  picker: DatepickerComponent = this.querySelector('dp-datepicker')
  currentDate: Date

  static get observedAttributes(): string[] {
    return ['date', 'placeholder']
  }

  constructor(
    changed: (value: number) => void,
    date?: number,
    placeholder?: string
  ) {
    super(tmpl)

    this.input.addEventListener('click', () => {
      this.classList.toggle('active')
    })
    this.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    document.addEventListener('click', (e) => {
      this.classList.remove('active')
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
