import Address from '~/model/data/Address'
import Category from '~/model/data/Category'
import Contact from '~/model/data/Contact'
import Email from '~/model/data/Email'
import Phonenumber from '~/model/data/Phonenumber'
import Relationship from '~/model/data/Relationship'
import RWStatus from '~/model/data/RWStatus'

export default abstract class ICompany {
  abstract id?: number
  abstract name?: string
  abstract addresses?: Address[]
  abstract emails?: Email[]
  abstract phonenumbers?: Phonenumber[]
  abstract contact_person?: Contact
  abstract websites?: string[]
  abstract remarks?: string
  abstract rwstatus?: RWStatus
  abstract relationship?: Relationship
  abstract categories?: Category[]
}
