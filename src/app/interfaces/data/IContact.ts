import Address from '~/model/data/Address'
import Category from '~/model/data/Category'
import CompanyWithLocation from '~/model/data/CompanyWithLocation'
import Contact from '~/model/data/Contact'
import Email from '~/model/data/Email'
import Gender from '~/model/data/Gender'
import Phonenumber from '~/model/data/Phonenumber'
import Relationship from '~/model/data/Relationship'
import RWStatus from '~/model/data/RWStatus'
import Salutation from '~/model/data/Salutation'
import Socialmedia from '~/model/data/Socialmedia'
import Title from '~/model/data/Title'

export default abstract class IContact {
  abstract id?: number
  abstract gender?: Gender
  abstract salutation?: Salutation
  abstract title?: Title
  abstract givenname?: string
  abstract additional_names?: string[]
  abstract surname?: string
  abstract addresses?: Address[]
  abstract companiesWithLocation?: CompanyWithLocation[]
  abstract department?: string
  abstract positions?: string[]
  abstract phonenumbers?: Phonenumber[]
  abstract emails?: Email[]
  abstract birthdate?: number
  abstract partner?: Contact
  abstract websites?: string[]
  abstract social_medias?: Socialmedia[]
  abstract remarks?: string
  abstract rwstatus?: RWStatus
  abstract relationship?: Relationship
  abstract categories?: Category[]
}
