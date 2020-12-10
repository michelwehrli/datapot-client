import Address from '~/model/data/Address'
import Company from '~/model/data/Company'

export default abstract class ICompanyWithLocation {
  abstract id?: number
  abstract company?: Company
  abstract address?: Address
}
