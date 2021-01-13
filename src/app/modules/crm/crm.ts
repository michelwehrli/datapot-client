import BaseComponent from '~/baseComponent'
import NavigationComponent from '~/components/navigation/navigation'
import NotFoundContent from '~/contents/404/404'
import DetailContent from '~/contents/detail/detail'
import EditContent from '~/contents/edit/edit'
import TaskContent from '~/contents/tasks/tasks'
import ListContent from '~/contents/list/list'
import DataService from '~/services/DataService'
import DesignService from '~/services/DesignService'
import TaskService from '~/services/TaskService'
import HttpService from '~/services/HttpService'
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
    TaskService.init()

    // build cache
    HttpService.get('data/contact', false, true)
    HttpService.get('data/company', false, true)

    this.navigation.init()
    this.navigation.navigated()
    this.contentContainer = this.querySelector('.content')
    this.handleNavigated()
    Router.on('crm-navigated', 'crm', async () => await this.handleNavigated())

    if (
      SessionService.user &&
      SessionService.user.design &&
      SessionService.user.design.uniquename
    ) {
      DesignService.init(
        SessionService.user.design.uniquename,
        this.navigation.getDesignToggler()
      )
    }
  }

  private async handleNavigated() {
    this.contentContainer.innerHTML = ''

    this.navigation.navigated()
    DesignService.toggle(SessionService.user.design.uniquename)

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
        case 'TaskContent':
          this.contentContainer.appendChild(new TaskContent())
          break
        case 'NotFoundContent':
          this.contentContainer.appendChild(new NotFoundContent())
          break
      }
    } else {
      this.contentContainer.appendChild(new NotFoundContent())
    }
  }
}
