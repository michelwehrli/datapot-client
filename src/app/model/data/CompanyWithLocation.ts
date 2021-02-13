import HorizontalWrapperComponent from '~/components/form/horizontal-wrapper/horizontal-wrapper'
import InputSelectComponent from '~/components/form/input-select/input-select'
import ICompanyWithLocation from '~/interfaces/data/ICompanyWithLocation'
import { DataService, getSelect, ObjectFactory } from '~/internal'

import { Table } from '../extend/Table'
import { Address } from './Address'
import { Company } from './Company'

export class CompanyWithLocation extends Table implements ICompanyWithLocation {
  id?: number
  company?: Company
  address?: Address

  constructor(data: ICompanyWithLocation = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.company = data.company
      ? ObjectFactory.create<Company>('Company', data.company)
      : undefined
    this.address = data.address
      ? ObjectFactory.create<Address>('Address', data.address)
      : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.company.toString()
  }

  public validate(): boolean {
    this.addressSelector.classList.toggle('error', !this.address)
    this.companySelector.classList.toggle('error', !this.company)
    return !!this.address && !!this.company
  }

  private addressSelector: InputSelectComponent
  private companySelector: InputSelectComponent

  public async getField(isInitial: boolean): Promise<any> {
    this.addressSelector = new InputSelectComponent(
      (value: Address) => (this.address = value),
      await CompanyWithLocation.getAddressSelectMap(this.company),
      this.address ? this.address.id : undefined,
      true
    )

    this.companySelector = await getSelect.call(
      this,
      'company',
      this.company ? this.company.id : undefined,
      Company,
      'id',
      undefined,
      async (company: Company) => {
        this.addressSelector.setValues(
          await CompanyWithLocation.getAddressSelectMap(company)
        )
        this.company = company
      },
      true
    )

    return {
      ...(!isInitial && {
        company: new HorizontalWrapperComponent([
          this.companySelector,
          this.addressSelector,
        ]),
      }),
    }
  }

  public static async getAddressSelectMap(
    company: Company
  ): Promise<Address[]> {
    let values = company.addresses
    const datamodel = await DataService.getDatamodel('address')
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
    if (company) {
      for (const raw of values) {
        const entry = ObjectFactory.create<Address>('Address', raw)
        ret.push({ key: entry.id, realValue: entry, value: entry.toString() })
      }
    }
    return ret
  }
}
