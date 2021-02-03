import InputCheckboxComponent from '~/components/form/input-checkbox/input-checkbox'
import InputDocumentSelectorComponent from '~/components/form/input-document-selector/input-document-selector'
import InputFileComponent from '~/components/form/input-file/input-file'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IDocument from '~/interfaces/system/IDocument'
import { Table } from '../extend/Table'

export class Document extends Table implements IDocument {
  id: number
  name?: string
  document?: string
  issecure?: boolean
  url?: string
  previewUrl?: string

  constructor(data: IDocument = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.name = data.name ? data.name : undefined
    this.document = data.document ? data.document : undefined
    this.issecure = data.issecure ? data.issecure : undefined
    this.url = data.url ? data.url : undefined
    this.previewUrl = data.previewUrl ? data.previewUrl : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.name
  }

  public validate(): boolean {
    this.fieldName.classList.toggle('error', !this.name)
    return !!this.name
  }

  private fieldName: InputTextComponent

  public async getField(
    isInitial?: boolean,
    changed?: (value: Document) => Document
  ): Promise<any> {
    this.fieldName = new InputTextComponent(
      (value: string) => (this.name = value),
      EInputType.TEXT,
      this.name,
      undefined,
      true
    )

    return {
      ...(isInitial && {
        name: this.fieldName,
        document: new InputFileComponent(
          (fileBase64: string) => (this.document = fileBase64),
          this.url
        ),
        issecure: new InputCheckboxComponent(
          (value: boolean) => (this.issecure = value),
          this.issecure,
          undefined,
          true
        ),
      }),
      ...(!isInitial && {
        id: new InputDocumentSelectorComponent(changed, this),
      }),
    }
  }
}
