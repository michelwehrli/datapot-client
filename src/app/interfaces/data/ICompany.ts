import Address from '~/model/data/Address'
import Email from '~/model/data/Email'
import Phonenumber from '~/model/data/Phonenumber'

export default abstract class ICompany {
  abstract id?: number
  abstract name?: string
  abstract addresses?: Address[]
  abstract emails?: Email[]
  abstract phonenumbers?: Phonenumber[]
  abstract websites?: string[]
  abstract remarks?: string
}
