import ModalComponent from '~/components/modal/modal'
import Design from '~/model/system/Design'
import User from '~/model/system/User'
import LoginModule from '~/modules/login/login'
import DataService from './DataService'
import HttpService from './HttpService'
import { Router } from './Router'

export default class SessionService {
  public static user: User
  private static interval: NodeJS.Timer

  public static async init(): Promise<void> {
    await this.refresh()
    this.kickInterval()
  }

  public static async refresh(): Promise<void> {
    if (localStorage.getItem('user')) {
      const userData = await DataService.getData(
        `system/user/${localStorage.getItem('user')}`,
        false,
        true
      )
      if (userData) {
        this.user = new User(userData)
      } else {
        this.logout()
      }
    } else {
      this.logout()
    }
  }

  public static kickInterval(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(async () => {
      if (!(await this.isLoggedIn())) {
        clearInterval(this.interval)
        const modal = new ModalComponent(
          new LoginModule(() => {
            modal.close()
            this.kickInterval()
          }),
          undefined,
          undefined,
          true
        )
        modal.classList.add('login')
      }
    }, 60000)
  }

  public static async setDesign(design: string): Promise<void> {
    this.user.design = new Design({
      label: design === 'dark' ? 'Dunkel' : 'Hell',
      uniquename: design,
    })
    await HttpService.post(`data/user/${this.user.id}`, this.user)
    await this.refresh()
  }

  public static async isLoggedIn(): Promise<boolean> {
    const result = await HttpService.get('authorized', true, true)
    return result.authorized
  }

  public static notAuthorized(): void {
    return Router.navigate('login')
  }

  public static async logout(): Promise<void> {
    clearInterval(this.interval)
    this.user = undefined
    localStorage.removeItem('user')
    await DataService.postData('logout', undefined, true)
  }
}
