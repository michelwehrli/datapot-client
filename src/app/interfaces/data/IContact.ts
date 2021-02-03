import IAddress from './IAddress'
import ICategory from './ICategory'
import ICompanyWithLocation from './ICompanyWithLocation'
import IEmail from './IEmail'
import IGender from './IGender'
import IPhonenumber from './IPhonenumber'
import IRelationship from './IRelationship'
import IRWStatus from './IRWStatus'
import ISalutation from './ISalutation'
import ISocialmedia from './ISocialmedia'
import ITitle from './ITitle'

export default abstract class IContact {
  abstract id?: number
  abstract gender?: IGender
  abstract salutation?: ISalutation
  abstract title?: ITitle
  abstract givenname?: string
  abstract additional_names?: string[]
  abstract surname?: string
  abstract addresses?: IAddress[]
  abstract companiesWithLocation?: ICompanyWithLocation[]
  abstract department?: string
  abstract positions?: string[]
  abstract phonenumbers?: IPhonenumber[]
  abstract emails?: IEmail[]
  abstract birthdate?: number
  abstract partner?: IContact
  abstract websites?: string[]
  abstract social_medias?: ISocialmedia[]
  abstract remarks?: string
  abstract rwstatus?: IRWStatus
  abstract relationship?: IRelationship
  abstract categories?: ICategory[]
}
