import IAddress from './IAddress'
import ICategory from './ICategory'
import IContact from './IContact'
import IEmail from './IEmail'
import IPhonenumber from './IPhonenumber'
import IRelationship from './IRelationship'
import IRWStatus from './IRWStatus'
import ISocialmedia from './ISocialmedia'

export default abstract class ICompany {
  abstract id?: number
  abstract name?: string
  abstract addresses?: IAddress[]
  abstract emails?: IEmail[]
  abstract phonenumbers?: IPhonenumber[]
  abstract contact_person?: IContact
  abstract websites?: string[]
  abstract social_medias?: ISocialmedia[]
  abstract remarks?: string
  abstract rwstatus?: IRWStatus
  abstract relationship?: IRelationship
  abstract categories?: ICategory[]
}
