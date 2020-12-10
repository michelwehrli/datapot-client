import BaseComponent from '~/baseComponent'
import NavigationComponent from '~/components/navigation/navigation'
import NotFoundContent from '~/contents/404/404'
import DetailContent from '~/contents/detail/detail'
import EditContent from '~/contents/edit/edit'
import ListContent from '~/contents/list/list'
import DataService from '~/services/DataService'
import { Router } from '~/services/Router'
import SessionService from '~/services/SessionService'
import tmpl from './crm.html'

export default class CrmModule extends BaseComponent {
  contentContainer: HTMLDivElement
  navigation: NavigationComponent = this.querySelector('dp-navigation')

  constructor() {
    super(tmpl)
  }

  public async init(): Promise<void> {
    await DataService.init()
    await SessionService.init()
    this.navigation.init()
    this.contentContainer = this.querySelector('.content')
    this.handleNavigated()
    Router.on('crm-navigated', 'crm', async () => await this.handleNavigated())
  }

  private handleNavigated() {
    this.contentContainer.innerHTML = ''

    if (Router.getRoute() && Router.getRoute()[1]) {
      switch (Router.getRoute()[1]) {
        case 'EditContent':
          this.contentContainer.appendChild(new EditContent())
          break
        case 'ListContent':
          this.contentContainer.appendChild(new ListContent())
          break
        case 'DetailContent':
          this.contentContainer.appendChild(new DetailContent())
          break
        case 'NotFoundContent':
          this.contentContainer.appendChild(new NotFoundContent())
          break
      }
    } else {
      this.contentContainer.appendChild(new ListContent())
    }
  }
}
