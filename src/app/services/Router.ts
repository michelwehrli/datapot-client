export class Router {
  private static routes: Map<string, string> = new Map()
  private static routesReverse: Map<string, string> = new Map()
  private static history: string[] = []
  private static currentRoute: string[]
  private static currentParams: string[]
  private static listeners: Map<string, Map<string, () => void>> = new Map()

  public static init(): void {
    const protocol: string = window.location.protocol
    const host: string = window.location.host
    const route: string = window.location.href
      .replace(`${protocol}//${host}/`, '')
      .replace(/^\/|\/$/g, '')
    this.parseRoute(route)

    history.replaceState({ route: route }, null, route)

    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.navigate(e.state.route, e.state.container, undefined, true)
      }
    })
  }

  public static getRoute(): string[] {
    return this.currentRoute
  }
  public static getParams(): string[] {
    return this.currentParams
  }
  public static getUrl(route: string[] = this.currentRoute): string {
    const routes = this.routesReverse[route.join(',')].split('/')
    if (this.currentParams.length) {
      this.currentParams.forEach((entry) => {
        routes.push(entry)
      })
    }
    return routes.join('/')
  }

  public static add(route: string, ...componentTypes: string[]): void {
    this.routes[route] = componentTypes
    this.routesReverse[componentTypes.join(',')] = route
  }

  public static navigate(
    route: string,
    container?: string,
    e?: MouseEvent,
    dontPush = false
  ): void {
    this.parseRoute(route)
    if (e && e.ctrlKey) {
      window.open(route)
      return
    }
    this.parseRoute(route)
    if (!dontPush) {
      history.pushState({ route: route, container: container }, null, route)
      this.history.push(route)
    }
    this.raise(`${container ? `${container}-` : ''}navigated`)
  }
  public static refresh(): void {
    this.raise('navigated')
  }
  public static back(): void {
    this.history.pop() // pop thrice to remove 404
    this.history.pop()
    this.navigate(this.history.pop())
  }

  public static hasHistory(): boolean {
    return this.history.length > 0
  }

  public static on(type: string, where: string, fn: () => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = new Map()
    }
    this.listeners[type][where] = fn
  }

  private static parseRoute(route: string): void {
    this.currentParams = []
    if (!route) return
    const split = route.split('/')
    let search: string = split.join('/')
    while (search) {
      this.currentRoute = this.routes[search]
      if (this.currentRoute) {
        break
      }
      if (split.length) {
        this.currentParams.push(split.pop())
        search = split.join('/')
      }
    }
    this.currentParams.reverse()
  }

  private static raise(type: string): void {
    setTimeout(() => {
      if (this.listeners[type]) {
        Object.keys(this.listeners[type]).forEach((where) => {
          this.listeners[type][where]()
        })
      }
    })
  }
}

export class Route {}
