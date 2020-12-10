import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IZip from '~/interfaces/data/IZip'
import DataService from '~/services/DataService'
import Table from '../extend/Table'

export default class Zip extends Table implements IZip {
  id: number
  zip: string
  location: string

  constructor(data: IZip = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.zip = data.zip ? data.zip : undefined
    this.location = data.location ? data.location : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    if (this.zip && this.location) {
      return `${this.zip} ${this.location}`
    }
    return undefined
  }

  public validate(): boolean {
    if (this.fieldZip) {
      this.fieldZip.classList.toggle('error', !this.zip)
    }
    if (this.fieldLocation) {
      this.fieldLocation.classList.toggle('error', !this.location)
    }
    return !!this.zip && !!this.location
  }

  private fieldZip: InputTextComponent
  private fieldLocation: InputTextComponent

  public async getField(): Promise<any> {
    this.fieldZip = new InputTextComponent(
      (value: string) => (this.zip = value),
      EInputType.TEXT,
      this.zip,
      undefined,
      true
    )
    this.fieldLocation = new InputTextComponent(
      (value: string) => (this.location = value),
      EInputType.TEXT,
      this.location,
      undefined,
      true
    )

    return {
      zip: this.fieldZip,
      location: this.fieldLocation,
    }
  }

  public static async getSelectMap(): Promise<Map<number, string>> {
    const values = await DataService.getData('data/zip')
    const ret: Map<number, string> = new Map()
    for (const raw of values as IZip[]) {
      const zip = new Zip(raw)
      ret[zip.id] = { realValue: zip, value: `${zip.zip} ${zip.location}` }
    }
    return ret
  }
}
