import BaseComponent from '~/baseComponent'
import DataService from '~/services/DataService'
import { Router } from '~/services/Router'
import SessionService from '~/services/SessionService'
import ButtonComponent from '../button/button'
import NavigationGroupComponent from '../navigation-group/navigation-group'
import NavigationItemComponent from '../navigation-item/navigation-item'
import tmpl from './navigation.html'

export default class NavigationComponent extends BaseComponent {
  items: HTMLDivElement
  navItems: Map<string, NavigationItemComponent> = new Map()
  namePara: HTMLParagraphElement = this.querySelector('.js-name')
  imageE: HTMLImageElement = this.querySelector('.js-image')
  logoutButton: ButtonComponent = this.querySelector('.js-logout')
  activeItem: NavigationItemComponent

  constructor() {
    super(tmpl)
    this.items = this.querySelector('.items')
  }

  public init(): void {
    this.createNavigation().then(() => {
      if (Router.getParams()) {
        const navPoint: string = Router.getParams()[0]
        if (navPoint && this.navItems && this.navItems[navPoint]) {
          this.navItems[navPoint].setAttribute('active', 'true')
          this.activeItem = this.navItems[navPoint]
        }
      }
    })

    this.logoutButton.addEventListener('button-click', async () => {
      await SessionService.logout()
    })

    this.namePara.innerText = `${SessionService.user.givenname} ${SessionService.user.surname}`

    if (
      SessionService.user &&
      SessionService.user.image &&
      SessionService.user.image.previewUrl
    ) {
      this.imageE.src = SessionService.user.image.previewUrl
    }
  }

  private async createNavigation(): Promise<void> {
    const datamodel = DataService.getDatamodel()
    if (!datamodel) {
      return
    }
    const groups: Map<number, any> = new Map()
    const processedDatamodel: Map<number, any[]> = new Map()

    Object.keys(datamodel).forEach((tableName) => {
      const model = datamodel[tableName]
      if (model.__meta.isGroup) {
        groups[model.__meta.number] = model
      } else if (model.__meta.parent) {
        if (!processedDatamodel[model.__meta.parent]) {
          processedDatamodel[model.__meta.parent] = []
        }
        if (model.__meta.isListable) {
          processedDatamodel[model.__meta.parent].push(model)
        }
      }
    })

    Object.values(groups)
      .sort((a: any, b: any) => {
        if (a.__meta.sort < b.__meta.sort) return -1
        if (a.__meta.sort > b.__meta.sort) return 1
        return 0
      })
      .forEach((group) => {
        const groupComponent = new NavigationGroupComponent(group.__meta.title)
        this.items.appendChild(groupComponent)

        Object.values(processedDatamodel[group.__meta.number])
          .sort((a: any, b: any) => {
            if (a.__meta.titlePlural < b.__meta.titlePlural) {
              return -1
            }
            if (a.__meta.titlePlural > b.__meta.titlePlural) {
              return 1
            }
            return 0
          })
          .sort((a: any, b: any) => {
            return a.__meta.isMain === b.__meta.isMain
              ? 0
              : a.__meta.isMain
              ? -1
              : 1
          })
          .forEach((item: any) => {
            const navItem: NavigationItemComponent = new NavigationItemComponent(
              item.__meta
            )
            this.navItems[item.__meta.name] = navItem
            groupComponent.addItem(navItem)

            navItem.addEventListener('click', () => {
              if (this.activeItem) {
                this.activeItem.setAttribute('active', 'false')
              }
              this.activeItem = navItem
              this.activeItem.setAttribute('active', 'true')
              Router.navigate(`crm/list/${item.__meta.name}`, 'crm')
            })
          })
      })
  }
}
