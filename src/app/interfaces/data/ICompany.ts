import Address from '~/model/data/Address'
import Contact from '~/model/data/Contact'
import Email from '~/model/data/Email'
import Phonenumber from '~/model/data/Phonenumber'

export default abstract class ICompany {
  abstract id?: number
  abstract name?: string
  abstract addresses?: Address[]
  abstract emails?: Email[]
  abstract phonenumbers?: Phonenumber[]
  abstract contact_person?: Contact
  abstract websites?: string[]
  abstract remarks?: string
}
