export default class HttpService {
  private static datamodelBase = 'https://core.datapot.ch/api/123/datamodel'
  private static dataBase = 'https://core.datapot.ch/api/123/data/'
  private static defaultBase = 'https://core.datapot.ch/api/123/'

  public static async getDatamodel(): Promise<any> {
    return await (
      await fetch(`${this.datamodelBase}`, {
        mode: 'cors',
        method: 'get',
        cache: 'no-cache',
        credentials: 'include',
      })
    ).json()
  }

  public static async get(url: string, useDefaultBase = false): Promise<any> {
    return await (
      await fetch(
        useDefaultBase ? `${this.defaultBase}${url}` : `${this.dataBase}${url}`,
        {
          mode: 'cors',
          credentials: 'include',
        }
      )
    ).json()
  }

  public static async post(
    url: string,
    data?: any,
    useDefaultBase = false
  ): Promise<any> {
    return (
      await fetch(
        useDefaultBase ? `${this.defaultBase}${url}` : `${this.dataBase}${url}`,
        {
          mode: 'cors',
          method: 'post',
          cache: 'no-cache',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
    ).json()
  }

  public static async patch(url: string, data: any): Promise<any> {
    return (
      await fetch(`${this.dataBase}${url}`, {
        mode: 'cors',
        method: 'patch',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    ).json()
  }

  public static async remove(url: string): Promise<any> {
    return (
      await fetch(`${this.dataBase}${url}`, {
        mode: 'cors',
        method: 'delete',
        cache: 'no-cache',
        credentials: 'include',
      })
    ).json()
  }
}
