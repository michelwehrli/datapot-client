import ModalComponent from '~/components/modal/modal'
import User from '~/model/system/User'
import LoginModule from '~/modules/login/login'
import DataService from './DataService'
import HttpService from './HttpService'
import { Router } from './Router'

export default class SessionService {
  public static user: User

  private static interval: NodeJS.Timer

  public static async init(): Promise<void> {
    const userData = await DataService.getData(
      `system/user/${localStorage.getItem('user')}`
    )
    if (userData) {
      this.user = new User(userData)
    } else {
      this.logout()
    }

    this.kickInterval()
  }

  public static kickInterval(): void {
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

  public static async isLoggedIn(): Promise<boolean> {
    const result = await HttpService.get('authorized', true)
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
