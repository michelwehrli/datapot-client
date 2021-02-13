import BaseComponent from '~/baseComponent'
import tmpl from './input-file.html'

export default class InputFileComponent extends BaseComponent {
  input: HTMLInputElement = this.querySelector('input')
  img: HTMLImageElement = this.querySelector('img')
  error: HTMLParagraphElement = this.querySelector('.error')

  constructor(changed: (value: string) => void, value: string) {
    super(tmpl)

    if (value) {
      this.img.src = value
      this.img.classList.add('visible')
    }

    this.input.addEventListener('change', async () => {
      this.img.classList.remove('visible')
      this.classList.remove('error')
      this.error.innerText = ''

      const file: Blob = this.input.files[0]
      if (file) {
        if (
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/x-icon'
        ) {
          const base64 = await this.toBase64(file)
          this.img.src = base64
          this.img.classList.add('visible')
          changed(base64)
        } else {
          this.classList.add('error')
          this.error.innerText = `Es können keine Dateien vom Typ "${file.type}" gespeichert werden.`
        }
      }
    })
  }

  private async toBase64(file: Blob): Promise<string> {
    return new Promise<string>((resolve) => {
      const fileReader: FileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.addEventListener('load', () => {
        resolve(<string>fileReader.result)
      })
      fileReader.addEventListener('error', () => {
        resolve('')
      })
    })
  }

  public focus(): void {
    this.input.focus()
  }
}
