import DesignTogglerComponent from '~/components/design-toggler/design-toggler'

export class DesignService {
  public static designStyles: Map<string, HTMLStyleElement> = new Map()

  public static init(
    design: string,
    designToggler?: DesignTogglerComponent
  ): void {
    this.toggle(design, designToggler)
  }

  public static toggle(
    design: string,
    designToggler?: DesignTogglerComponent
  ): void {
    if (design === 'light') {
      document.body.classList.add('design-light')
      document.body.classList.remove('design-dark')
      if (designToggler) {
        designToggler.setAttribute('design', 'light')
      }
    } else {
      document.body.classList.add('design-dark')
      document.body.classList.remove('design-light')
      if (designToggler) {
        designToggler.setAttribute('design', 'dark')
      }
    }
  }
}
