import ButtonComponent from './components/button/button'
import ConfirmationComponent from './components/confirmation/confirmation'
import ContentHeaderComponent from './components/content-header/content-header'
import DatepickerComponent from './components/datepicker/datepicker'
import DesignTogglerComponent from './components/design-toggler/design-toggler'
import DocumentSelectorComponent from './components/document-selector/document-selector'
import FooterComponent from './components/footer/footer'
import FieldComponent from './components/form/field/field'
import FormHeadingComponent from './components/form/form-heading/form-heading'
import HorizontalWrapperComponent from './components/form/horizontal-wrapper/horizontal-wrapper'
import InputCheckboxComponent from './components/form/input-checkbox/input-checkbox'
import InputDateComponent from './components/form/input-date/input-date'
import InputDocumentSelectorComponent from './components/form/input-document-selector/input-document-selector'
import InputFileComponent from './components/form/input-file/input-file'
import InputPasswordComponent from './components/form/input-password/input-password'
import InputSelectComponent from './components/form/input-select/input-select'
import InputTextComponent from './components/form/input-text/input-text'
import InputTextareaComponent from './components/form/input-textarea/input-textarea'
import InputMultipleComponent from './components/form/multiple/multiple'
import InputMultipleItemComponent from './components/form/multiple/multiple-item/multiple-item'
import SubmitButtonComponent from './components/form/submit-button/submit-button'
import ListComponent from './components/list/list'
import ModalComponent from './components/modal/modal'
import NavigationGroupComponent from './components/navigation-group/navigation-group'
import NavigationItemComponent from './components/navigation-item/navigation-item'
import NavigationComponent from './components/navigation/navigation'
import ToastComponent from './components/toast/toast'
import NotFoundContent from './contents/404/404'
import DetailContent from './contents/detail/detail'
import EditContent from './contents/edit/edit'
import ListContent from './contents/list/list'
import TaskContent from './contents/tasks/tasks'
import CrmModule from './modules/crm/crm'
import LoginModule from './modules/login/login'

import {
  Address,
  Category,
  CompanyWithLocation,
  CompetenceField,
  Complexity,
  Contact,
  Country,
  County,
  Design,
  Email,
  EmailType,
  Gender,
  Industry,
  KeyValue,
  Phonenumber,
  PhonenumberLine,
  PhonenumberType,
  Projectreference,
  Relationship,
  ResponsibleArea,
  Role,
  Router,
  RWStatus,
  Salutation,
  SessionService,
  Socialmedia,
  SocialmediaType,
  Table,
  Title,
  ToastService,
  User,
  Zip,
} from './internal'

import '../styles/app.scss'
;(async () => {
  /* MODULES */
  customElements.define('dp-module-login', LoginModule)
  customElements.define('dp-module-crm', CrmModule)

  /* CONTENTS */
  customElements.define('dp-content-detail', DetailContent)
  customElements.define('dp-content-edit', EditContent)
  customElements.define('dp-content-list', ListContent)
  customElements.define('dp-content-task', TaskContent)
  customElements.define('dp-404', NotFoundContent)

  /* COMPONENTS */
  customElements.define('dp-button', ButtonComponent)
  customElements.define('dp-submit-button', SubmitButtonComponent)
  customElements.define('dp-navigation', NavigationComponent)
  customElements.define('dp-navigation-item', NavigationItemComponent)
  customElements.define('dp-navigation-group', NavigationGroupComponent)
  customElements.define('dp-footer', FooterComponent)
  customElements.define('dp-content-header', ContentHeaderComponent)
  customElements.define('dp-list', ListComponent)
  customElements.define('dp-confirmation', ConfirmationComponent)
  customElements.define('dp-document-selector', DocumentSelectorComponent)
  customElements.define('dp-input-text', InputTextComponent)
  customElements.define('dp-input-textarea', InputTextareaComponent)
  customElements.define('dp-input-password', InputPasswordComponent)
  customElements.define('dp-datepicker', DatepickerComponent)
  customElements.define('dp-select', InputSelectComponent)
  customElements.define('dp-checkbox', InputCheckboxComponent)
  customElements.define('dp-input-date', InputDateComponent)
  customElements.define('dp-input-file', InputFileComponent)
  customElements.define(
    'dp-input-document-selector',
    InputDocumentSelectorComponent
  )
  customElements.define('dp-design-toggler', DesignTogglerComponent)
  customElements.define('dp-modal', ModalComponent)
  customElements.define('dp-multiple', InputMultipleComponent)
  customElements.define('dp-multiple-item', InputMultipleItemComponent)
  customElements.define('dp-field', FieldComponent)
  customElements.define('dp-horizontal-wrapper', HorizontalWrapperComponent)
  customElements.define('dp-form-heading', FormHeadingComponent)
  customElements.define('dp-toast', ToastComponent)

  const appRoot: HTMLDivElement = document.querySelector('app-root')

  ToastService.init(document.querySelector('.toast-container'))

  /* DEFINE ROUTES */
  Router.add('login', 'LoginModule')

  Router.add('crm', 'CrmModule')
  Router.add('crm/detail', 'CrmModule', 'DetailContent')
  Router.add('crm/edit', 'CrmModule', 'EditContent')
  Router.add('crm/list', 'CrmModule', 'ListContent')
  Router.add('crm/tasks', 'CrmModule', 'TaskContent')
  Router.add('crm/404', 'CrmModule', 'NotFoundContent')

  /* ROUTING */
  Router.init()
  await SessionService.init()

  Router.on('navigated', 'app', async () => await handleNavigated())
  async function handleNavigated() {
    appRoot.innerHTML = ''

    if (
      (await SessionService.isLoggedIn()) &&
      Router.getRoute() &&
      Router.getRoute()[0]
    ) {
      let module
      switch (Router.getRoute()[0]) {
        case 'LoginModule':
          appRoot.appendChild(new LoginModule())
          break
        case 'CrmModule':
          module = new CrmModule()
          await module.init()
          appRoot.appendChild(module)
          break
      }
    } else {
      appRoot.appendChild(new LoginModule())
    }
  }
  await handleNavigated()
})()
