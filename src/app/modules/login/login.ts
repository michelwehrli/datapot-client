import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import FieldComponent from '~/components/form/field/field'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import {
  DataService,
  DesignService,
  EToastType,
  ILoginResult,
  Router,
  SessionService,
  ToastService,
} from '~/internal'
import tmpl from './login.html'

export default class LoginModule extends BaseComponent {
  form: HTMLFormElement = this.querySelector('form')
  inputs: HTMLDivElement = this.querySelector('.inputs')
  submitButton: ButtonComponent = this.querySelector('dp-submit-button')

  private usernameField: InputTextComponent
  private passwordField: InputTextComponent

  private username: string
  private password: string

  constructor(done?: () => void) {
    super(tmpl)

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      DesignService.init('dark')
    } else {
      DesignService.init('light')
    }

    setTimeout(async () => {
      if (await SessionService.isLoggedIn()) {
        Router.navigate('crm/list/contact', 'crm')
        return
      }
    })

    this.usernameField = new InputTextComponent(
      (value: string) => (this.username = value),
      EInputType.TEXT,
      undefined,
      undefined,
      true,
      {
        autocomplete: 'username',
      }
    )
    this.passwordField = new InputTextComponent(
      (value: string) => (this.password = value),
      EInputType.PASSWORD,
      undefined,
      undefined,
      true,
      {
        autocomplete: 'password',
      }
    )

    this.inputs.appendChild(
      new FieldComponent('Benutzername', this.usernameField)
    )
    this.inputs.appendChild(new FieldComponent('Passwort', this.passwordField))

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault()

      this.usernameField.classList.toggle('error', !this.username)
      this.passwordField.classList.toggle('error', !this.password)

      if (this.username && this.password) {
        const result: ILoginResult = await DataService.login(
          this.username,
          this.password
        )
        if (result.success) {
          ToastService.add(
            'Du hast dich erfolgreich angemeldet.',
            EToastType.POSITIVE,
            3000
          )
          localStorage.setItem('user', result.user.id.toString())
          if (SessionService.isLoggedIn()) {
            if (done) {
              done()
            } else {
              if (
                !Router.getRoute() ||
                Router.getRoute().indexOf('LoginModule') > -1
              ) {
                Router.navigate('crm/list/contact')
              } else {
                Router.refresh()
              }
            }
          }
        } else {
          this.passwordField.setAttribute('value', '')
          ToastService.add(
            `Du konntest nicht angemeldet werden. ${
              result.error ? `(${result.error})` : ''
            }`,
            EToastType.NEGATIVE,
            3000
          )
        }
      }
    })
  }
}
