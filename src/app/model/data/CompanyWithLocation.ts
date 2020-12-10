import HorizontalWrapperComponent from '~/components/form/horizontal-wrapper/horizontal-wrapper'
import InputSelectComponent from '~/components/form/input-select/input-select'
import IAddress from '~/interfaces/data/IAddress'
import ICompanyWithLocation from '~/interfaces/data/ICompanyWithLocation'
import Table from '../extend/Table'
import Address from './Address'
import Company from './Company'

export default class CompanyWithLocation
  extends Table
  implements ICompanyWithLocation {
  id?: number
  company?: Company
  address?: Address

  constructor(data: ICompanyWithLocation = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.company = data.company ? new Company(data.company) : undefined
    this.address = data.address ? new Address(data.address) : undefined
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.company.toString()
  }

  public validate(): boolean {
    return true
  }

  private addressSelector: InputSelectComponent

  public async getField(isInitial: boolean): Promise<any> {
    this.addressSelector = new InputSelectComponent(
      (value: Address) => (this.address = value),
      await CompanyWithLocation.getAddressSelectMap(this.company),
      this.address ? this.address.id : undefined
    )

    return {
      ...(!isInitial && {
        company: new HorizontalWrapperComponent([
          new InputSelectComponent(
            async (value: Company) => {
              this.addressSelector.setValues(
                await CompanyWithLocation.getAddressSelectMap(value)
              )
              this.company = value
            },
            await Company.getSelectMap(),
            this.company ? this.company.id : undefined
          ),
          this.addressSelector,
        ]),
      }),
    }
  }

  public static async getAddressSelectMap(
    company: Company
  ): Promise<Map<string, any>> {
    const ret: Map<string, any> = new Map()
    for (const raw of company.addresses as IAddress[]) {
      const entry = new Address(raw)
      ret[entry.id] = { realValue: entry, value: entry.toString() }
    }
    return ret
  }
}
