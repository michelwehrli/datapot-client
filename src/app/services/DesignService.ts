export default class DesignService {
  public static designStyles: Map<string, HTMLStyleElement> = new Map()

  public static init(design: string): void {
    return
    this.designStyles.set(
      'light',
      document.querySelectorAll('style')[0] as HTMLStyleElement
    )
    this.designStyles.set(
      'dark',
      document.querySelectorAll('style')[1] as HTMLStyleElement
    )

    this.toggle(design)
  }

  public static toggle(design: string): void {
    if (design === 'light') {
      this.designStyles.get('light').removeAttribute('media')
      this.designStyles.get('dark').setAttribute('media', 'max-width: 1px;')
    } else {
      this.designStyles.get('light').setAttribute('media', 'max-width: 1px;')
      this.designStyles.get('dark').removeAttribute('media')
    }
  }
}
