import InputSelectComponent from '~/components/form/input-select/input-select'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IAddress from '~/interfaces/data/IAddress'
import DataService from '~/services/DataService'
import Table from '../extend/Table'
import Country from './Country'
import County from './County'
import Zip from './Zip'

export default class Address extends Table implements IAddress {
  id: number
  street: string
  pobox?: string
  zip: Zip
  county?: County
  country?: Country

  constructor(data: IAddress = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.street = data.street ? data.street : undefined
    this.pobox = data.pobox ? data.pobox : undefined
    this.zip = data.zip ? new Zip(data.zip) : undefined
    this.county = data.county ? new County(data.county) : undefined
    this.country = data.country ? new Country(data.country) : undefined
  }

  getId(): number {
    return this.id
  }

  toString(): string {
    const values: string[] = []
    if (this.street) {
      values.push(this.street)
    }
    if (this.pobox) {
      values.push(this.pobox)
    }
    if (this.zip && this.zip.toString()) {
      values.push(this.zip.toString())
    }
    if (this.county && this.county.toString()) {
      values.push(this.county.toString())
    }
    if (this.country && this.country.toString()) {
      values.push(this.country.toString())
    }
    return values.join(', ')
  }

  public validate(): boolean {
    this.fieldStreet.classList.toggle('error', !this.street)
    return (
      !!this.street &&
      (this.zip ? this.zip.validate() : true) &&
      (this.county ? this.county.validate() : true) &&
      (this.country ? this.country.validate() : true)
    )
  }

  private fieldStreet: InputTextComponent

  public async getField(): Promise<any> {
    const datamodel: any = DataService.getDatamodel('address')

    this.fieldStreet = new InputTextComponent(
      (value: string) => (this.street = value),
      EInputType.TEXT,
      this.street,
      datamodel['street'].label,
      true
    )

    return {
      street: this.fieldStreet,
      pobox: new InputTextComponent(
        (value: string) => (this.pobox = value),
        EInputType.TEXT,
        this.pobox,
        datamodel['pobox'].label
      ),
      zip: new InputSelectComponent(
        (value: Zip) => (this.zip = value),
        await Zip.getSelectMap(),
        this.zip ? this.zip.id : undefined
      ),
      county: new InputSelectComponent(
        (value: County) => (this.county = value),
        await County.getSelectMap('data', 'county'),
        this.county ? this.county.uniquename : undefined
      ),
      country: new InputSelectComponent(
        (value: Country) => (this.country = value),
        await Country.getSelectMap('data', 'country'),
        this.country ? this.country.uniquename : undefined
      ),
    }
  }

  public static async getSelectMap(): Promise<Map<string, any>> {
    const entries = (await DataService.getData('data/address')) as Address[]
    const ret: Map<string, any> = new Map()
    for (const raw of entries as IAddress[]) {
      const entry = new Address(raw)
      ret[entry.id] = {
        realValue: entry,
        value: entry.toString(),
      }
    }
    return ret
  }
}
