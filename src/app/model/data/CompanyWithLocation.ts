import HorizontalWrapperComponent from '~/components/form/horizontal-wrapper/horizontal-wrapper'
import InputSelectComponent from '~/components/form/input-select/input-select'
import IAddress from '~/interfaces/data/IAddress'
import ICompanyWithLocation from '~/interfaces/data/ICompanyWithLocation'
import { ObjectFactory } from '~/internal'

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

    this.companySelector = new InputSelectComponent(
      async (value: Company) => {
        this.addressSelector.setValues(
          await CompanyWithLocation.getAddressSelectMap(value)
        )
        this.company = value
      },
      await Company.getSelectMap(),
      this.company ? this.company.id : undefined,
      true,
      () => {
        /*const modal = new ModalComponent(
          new EditContent(true, ['company'], async (value: Company) => {
            this.addressSelector.update(
              await CompanyWithLocation.getAddressSelectMap(value),
              value.addresses[value.addresses.length - 1].id
            )
            this.address = value.addresses[value.addresses.length - 1]
            this.companySelector.update(await Company.getSelectMap(), value.id)
            this.company = value
            modal.close()
          }),
          undefined,
          undefined,
          undefined,
          true
        )*/
      }
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
  ): Promise<Map<string, any>> {
    const ret: Map<string, any> = new Map()
    if (company) {
      for (const raw of company.addresses as IAddress[]) {
        const entry = ObjectFactory.create<Address>('Address', raw)
        ret[entry.id] = { realValue: entry, value: entry.toString() }
      }
    }
    return ret
  }
}
