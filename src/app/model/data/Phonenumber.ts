import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import ModalComponent from '~/components/modal/modal'
import EditContent from '~/contents/edit/edit'
import IPhonenumber from '~/interfaces/data/IPhonenumber'
import Table from '../extend/Table'
import EmailType from './EmailType'
import PhonenumberLine from './PhonenumberLine'
import PhonenumberType from './PhonenumberType'

export default class Phonenumber extends Table implements IPhonenumber {
  id: number
  number: string
  type: PhonenumberType
  line: PhonenumberLine

  constructor(data: IPhonenumber = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.number = data.number ? data.number : undefined
    this.type = data.type ? new PhonenumberType(data.type) : undefined
    this.line = data.line ? new PhonenumberLine(data.line) : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.number
  }

  public validate(): boolean {
    if (this.fieldNumber) {
      this.fieldNumber.classList.toggle('error', !this.number)
    }
    if (this.fieldType) {
      this.fieldType.classList.toggle('error', !this.type)
    }
    if (this.fieldLine) {
      this.fieldLine.classList.toggle('error', !this.line)
    }
    return !!this.number && !!this.type && !!this.line
  }

  private fieldNumber: InputTextComponent
  private fieldType: InputSelectComponent
  private fieldLine: InputSelectComponent

  public async getField(): Promise<any> {
    this.fieldNumber = new InputTextComponent(
      (value: string) => (this.number = value),
      EInputType.TEXT,
      this.number,
      undefined,
      true
    )
    this.fieldType = new InputSelectComponent(
      (value: PhonenumberType) => {
        this.type = value
      },
      await PhonenumberType.getSelectMap('data', 'phonenumber_type'),
      this.type ? this.type.uniquename : undefined,
      true,
      () => {
        const modal = new ModalComponent(
          new EditContent(
            true,
            ['phonenumber_type'],
            async (value: PhonenumberType) => {
              this.fieldType.update(
                await PhonenumberType.getSelectMap('data', 'phonenumber_type'),
                value.uniquename
              )
              this.type = value
              modal.close()
            }
          ),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )
    this.fieldLine = new InputSelectComponent(
      (value: PhonenumberLine) => (this.line = value),
      await PhonenumberLine.getSelectMap('data', 'phonenumber_line'),
      this.line ? this.line.uniquename : undefined,
      true,
      () => {
        const modal = new ModalComponent(
          new EditContent(
            true,
            ['phonenumber_line'],
            async (value: PhonenumberLine) => {
              this.fieldLine.update(
                await PhonenumberLine.getSelectMap('data', 'phonenumber_line'),
                value.uniquename
              )
              this.type = value
              modal.close()
            }
          ),
          undefined,
          undefined,
          undefined,
          true
        )
      }
    )

    return {
      number: this.fieldNumber,
      type: this.fieldType,
      line: this.fieldLine,
    }
  }
}
