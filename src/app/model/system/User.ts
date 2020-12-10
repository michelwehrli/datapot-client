import InputCheckboxComponent from '~/components/form/input-checkbox/input-checkbox'
import InputDocumentSelectorComponent from '~/components/form/input-document-selector/input-document-selector'
import InputPasswordComponent, {
  IInputPasswordValue,
} from '~/components/form/input-password/input-password'
import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IUser from '~/interfaces/system/IUser'
import DataService from '~/services/DataService'
import Table from '../extend/Table'
import Design from './Design'
import Document from './Document'

export default class User extends Table implements IUser {
  id: number
  issuperuser: boolean
  username: string
  givenname: string
  surname: string
  email: string
  image: Document
  password: string
  configuration: string
  design: Design
  color: string

  constructor(data: IUser = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.issuperuser = data.issuperuser ? data.issuperuser : undefined
    this.username = data.username ? data.username : undefined
    this.givenname = data.givenname ? data.givenname : undefined
    this.surname = data.surname ? data.surname : undefined
    this.email = data.email ? data.email : undefined
    this.image = data.image ? new Document(data.image) : undefined
    this.password = data.password ? data.password : undefined
    this.configuration = data.configuration ? data.configuration : undefined
    this.design = data.design ? new Design(data.design) : undefined
    this.color = data.color ? data.color : undefined
  }

  public getId(): number {
    return this.id
  }

  public validate(): boolean {
    this.fieldUsername.classList.toggle('error', !this.username)
    if (this.passwordDirty && !this.passwordValid) {
      this.fieldPassword.classList.toggle(
        'error',
        this.passwordDirty && !this.passwordValid
      )
    }
    return !!this.username && !!this.passwordValid
  }

  private fieldUsername: InputTextComponent
  private fieldPassword: InputPasswordComponent

  private passwordDirty: boolean
  private passwordValid = true

  public async getField(): Promise<any> {
    const datamodel: any = DataService.getDatamodel('user')

    this.fieldUsername = new InputTextComponent(
      (value: string) => (this.username = value),
      EInputType.TEXT,
      this.username,
      undefined,
      true,
      { autocomplete: 'new-username' }
    )
    this.fieldPassword = new InputPasswordComponent(
      (passwordResult: IInputPasswordValue) => {
        this.passwordDirty = true
        this.passwordValid = passwordResult.valid
        if (passwordResult.valid) {
          this.password = passwordResult.value
        }
      },
      { autocomplete: 'new-password' }
    )

    const configP = document.createElement('p')
    if (this.configuration) {
      configP.innerText = this.configuration
    } else {
      configP.innerText = '-'
    }

    return {
      username: this.fieldUsername,
      surname: new InputTextComponent(
        (value: string) => (this.surname = value),
        EInputType.TEXT,
        this.surname
      ),
      givenname: new InputTextComponent(
        (value: string) => (this.givenname = value),
        EInputType.TEXT,
        this.givenname
      ),
      email: new InputTextComponent(
        (value: string) => (this.email = value),
        EInputType.TEXT,
        this.email,
        undefined,
        undefined,
        { autocomplete: 'new-email' }
      ),
      password: this.fieldPassword,
      image: new InputDocumentSelectorComponent(
        (value: Document) => (this.image = value),
        this.image
      ),
      design: new InputSelectComponent(
        (value: Design) => (this.design = value),
        await Design.getSelectMap('system', 'design'),
        this.design ? this.design.uniquename : undefined
      ),
      issuperuser: new InputCheckboxComponent(
        (value: boolean) => (this.issuperuser = value),
        this.issuperuser,
        datamodel['issuperuser'].label,
        true
      ),
      configuration: configP,
    }
  }
}
