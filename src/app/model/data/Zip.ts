import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IZip from '~/interfaces/data/IZip'
import { DataService, ObjectFactory } from '~/internal'
import { Table } from '../extend/Table'

export class Zip extends Table implements IZip {
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

  public static async getSelectMap(): Promise<any[]> {
    let values = await DataService.getData<Zip[]>('data/zip')
    const datamodel = await DataService.getDatamodel('zip')
    const sortBy = datamodel?.__meta?.sort
    if (sortBy) {
      values = values.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return -1
        }
        if (a[sortBy] > b[sortBy]) {
          return 1
        }
        return 0
      })
    }
    const ret: any[] = []
    for (const raw of values as IZip[]) {
      const zip = ObjectFactory.create<Zip>('Zip', raw)
      ret.push({
        key: zip.id,
        realValue: zip,
        value: `${zip.zip} ${zip.location}`,
      })
    }
    return ret
  }
}
