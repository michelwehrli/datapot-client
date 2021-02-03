import ModalComponent from '~/components/modal/modal'
import IUser from '~/interfaces/system/IUser'
import { HttpService, Router } from '~/internal'
import { Design } from '~/model/system/Design'
import { User } from '~/model/system/User'
import LoginModule from '~/modules/login/login'
import { ObjectFactory } from './ObjectFactory'

export class DataService {
  private static datamodel: any

  public static async init(): Promise<void> {
    if (!this.datamodel) {
      const result = await HttpService.getDatamodel()
      if (!result.authorized) {
        SessionService.notAuthorized()
        return
      }
      this.datamodel = result.data
    }
  }

  public static getDatamodel(table?: string): any {
    if (table && this.datamodel[table]) {
      return this.datamodel[table]
    } else {
      return this.datamodel
    }
  }

  public static async getData<T>(
    query: string,
    useDefaultBase = false,
    noCache = false
  ): Promise<T | T[]> {
    const result = await HttpService.get(query, useDefaultBase, noCache)
    if (!result) {
      return
    }
    if (!result.authorized) {
      SessionService.notAuthorized()
      return
    }
    return result.data
  }

  public static async postData<T>(
    query: string,
    data: T,
    useDefaultBase?: boolean
  ): Promise<T> {
    const result = await HttpService.post(query, data, useDefaultBase)
    if (!result.authorized) {
      SessionService.notAuthorized()
      return
    }
    return result
  }

  public static async patchData<T>(query: string, data: T): Promise<T> {
    const result = await HttpService.post(query, data)
    if (!result.authorized) {
      SessionService.notAuthorized()
      return
    }
    return result
  }

  public static async removeData<T>(query: string): Promise<T> {
    const result = await HttpService.remove(query)
    if (!result.authorized) {
      SessionService.notAuthorized()
      return
    }
    return result
  }

  public static async login(
    username: string,
    password: string
  ): Promise<ILoginResult> {
    return (await HttpService.post(
      'login',
      {
        username: username,
        password: password,
      },
      true
    )) as ILoginResult
  }
}

interface ILoginResult {
  success: boolean
  user: IUser
  error?: string
}

export class SessionService {
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
        this.user = ObjectFactory.create('User', userData)
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
    this.user.design = ObjectFactory.create<Design>('Design', {
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
