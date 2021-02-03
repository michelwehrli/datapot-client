import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import IAddress from '~/interfaces/data/IAddress'
import { DataService, getSelect } from '~/internal'
import { ObjectFactory } from '~/services/ObjectFactory'
import { Table } from '../extend/Table'
import { Country } from './Country'
import { County } from './County'
import { Zip } from './Zip'

export class Address extends Table implements IAddress {
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
    this.zip = data.zip ? ObjectFactory.create<Zip>('Zip', data.zip) : undefined
    this.county = data.county
      ? ObjectFactory.create<County>('County', data.county)
      : undefined
    this.country = data.country
      ? ObjectFactory.create<Country>('Country', data.country)
      : undefined
  }

  getId(): number {
    return this.id
  }

  toString(separator?: string): string {
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
    return values.join(separator ? separator : ', ')
  }

  public validate(): boolean {
    this.fieldStreet.classList.toggle('error', !this.street)
    return (
      !!this.street &&
      (this.zip && this.zip.validate ? this.zip.validate() : true) &&
      (this.county && this.county.validate ? this.county.validate() : true) &&
      (this.country && this.country.validate ? this.country.validate() : true)
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

    const zipSelect = await getSelect.call(
      this,
      'zip',
      this.zip ? this.zip.id : undefined,
      Zip,
      'id'
    )

    const countySelect = await getSelect.call(
      this,
      'county',
      this.county ? this.county.uniquename : undefined,
      County,
      'uniquename'
    )

    const countrySelect = await getSelect.call(
      this,
      'country',
      this.country ? this.country.uniquename : undefined,
      Country,
      'uniquename'
    )

    return {
      street: this.fieldStreet,
      pobox: new InputTextComponent(
        (value: string) => (this.pobox = value),
        EInputType.TEXT,
        this.pobox,
        datamodel['pobox'].label
      ),
      zip: zipSelect,
      county: countySelect,
      country: countrySelect,
    }
  }

  public static async getSelectMap(): Promise<Map<string, any>> {
    const entries = (await DataService.getData('data/address')) as Address[]
    const ret: Map<string, any> = new Map()
    for (const raw of entries as IAddress[]) {
      const entry = ObjectFactory.create<Address>('Address', raw)
      ret[entry.id] = {
        realValue: entry,
        value: entry.toString(),
      }
    }
    return ret
  }
}
