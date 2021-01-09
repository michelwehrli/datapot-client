import IUser from '~/interfaces/system/IUser'
import HttpService from './HttpService'
import SessionService from './SessionService'

export default class DataService {
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
    data: any,
    useDefaultBase?: boolean
  ): Promise<T> {
    const result = await HttpService.post(query, data, useDefaultBase)
    if (!result.authorized) {
      SessionService.notAuthorized()
      return
    }
    return result
  }

  public static async patchData<T>(query: string, data: any): Promise<T> {
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

export interface ILoginResult {
  success: boolean
  user: IUser
  error?: string
}
