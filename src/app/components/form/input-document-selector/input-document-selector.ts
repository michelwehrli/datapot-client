import BaseComponent from '~/baseComponent'
import tmpl from './input-document-selector.html'
import { Document } from '../../../internal'
import ButtonComponent from '~/components/button/button'
import ModalComponent from '~/components/modal/modal'
import IDocument from '~/interfaces/system/IDocument'

export default class InputDocumentSelectorComponent extends BaseComponent {
  button: ButtonComponent = this.querySelector('dp-button')
  img: HTMLImageElement = this.querySelector('img')
  preview: ButtonComponent = this.querySelector('.js-preview')
  clear: ButtonComponent = this.querySelector('.js-clear')
  doc: IDocument

  constructor(changed: (value: Document) => IDocument, value: IDocument) {
    super(tmpl)

    this.doc = value

    this.button.addEventListener('button-click', () => {
      return
      const modal = new ModalComponent(
        new DocumentSelectorComponent((value: Document) => {
          modal.close()
          changed(value)
          this.doc = value
          this.button.setAttribute('text', `Auswahl: ${value.name}`)
          this.img.src = value.previewUrl
          this.img.classList.remove('hidden')
          this.preview.classList.remove('hidden')
          this.clear.classList.remove('hidden')
        }),
        'Wähle ein Dokument...',
        'fa fa-file-alt'
      )
    })

    this.preview.addEventListener('button-click', () => {
      window.open(this.doc.url)
    })

    this.clear.addEventListener('button-click', () => {
      changed(null)
      this.button.setAttribute('text', 'Dokument auswählen')
      this.img.removeAttribute('src')
      this.img.classList.add('hidden')
      this.preview.classList.add('hidden')
      this.clear.classList.add('hidden')
    })

    if (this.doc) {
      this.preview.classList.remove('hidden')
      this.clear.classList.remove('hidden')
      this.img.classList.remove('hidden')
      this.button.setAttribute('text', `Auswahl: ${this.doc.name}`)
      this.img.src = this.doc.previewUrl
    }
  }

  public focus(): void {
    this.button.focus()
  }
}
