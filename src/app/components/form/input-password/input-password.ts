import BaseComponent from '~/baseComponent'
import tmpl from './input-password.html'

export default class InputPasswordComponent extends BaseComponent {
  password: HTMLInputElement = this.querySelector('.password')
  confirm: HTMLInputElement = this.querySelector('.confirm')

  private changed: (value: IInputPasswordValue) => void

  constructor(changed: (value: IInputPasswordValue) => void, attributes?: any) {
    super(tmpl)

    this.changed = changed

    this.password.addEventListener('keyup', () => this.validateAndRaise())
    this.confirm.addEventListener('keyup', () => this.validateAndRaise())

    if (attributes) {
      for (const name in attributes) {
        this.password.setAttribute(name, attributes[name])
        this.confirm.setAttribute(name, attributes[name])
      }
    }
  }

  public focus(): void {
    this.password.focus()
  }

  private validateAndRaise() {
    this.confirm.classList.toggle(
      'error',
      this.confirm.value !== this.password.value
    )
    this.changed({
      value: this.password.value,
      valid: this.password.value === this.confirm.value,
    })
  }
}

export interface IInputPasswordValue {
  value: string
  valid: boolean
}
