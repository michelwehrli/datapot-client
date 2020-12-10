import BaseComponent from '~/baseComponent'
import IDocument from '~/interfaces/system/IDocument'
import Document from '~/model/system/Document'
import DataService from '~/services/DataService'
import tmpl from './document-selector.html'

export default class DocumentSelectorComponent extends BaseComponent {
  documentsWrap: HTMLDivElement = this.querySelector('.documents')

  private changed: (value: Document) => void

  constructor(changed: (value: Document) => void) {
    super(tmpl)

    this.changed = changed
    this.init()
  }

  private async init() {
    const docDatas = (await DataService.getData(
      'system/document'
    )) as IDocument[]
    for (const docData of docDatas) {
      const doc: Document = new Document(docData)
      this.documentsWrap.appendChild(this.createDocumentEntry(doc))
    }
  }

  private createDocumentEntry(doc: Document): HTMLDivElement {
    const div = document.createElement('div')
    div.classList.add('document')

    const img = document.createElement('img')
    img.src = doc.previewUrl
    div.appendChild(img)

    const p = document.createElement('p')
    p.innerText = doc.name
    div.appendChild(p)

    div.addEventListener('click', () => {
      this.changed(doc)
    })

    return div
  }
}
