import { Address } from '~/model/data/Address'
import { Category } from '~/model/data/Category'
import { Company } from '~/model/data/Company'
import { CompanyWithLocation } from '~/model/data/CompanyWithLocation'
import { Contact } from '~/model/data/Contact'
import { Country } from '~/model/data/Country'
import { County } from '~/model/data/County'
import { Email } from '~/model/data/Email'
import { EmailType } from '~/model/data/EmailType'
import { Gender } from '~/model/data/Gender'
import { Phonenumber } from '~/model/data/Phonenumber'
import { PhonenumberLine } from '~/model/data/PhonenumberLine'
import { PhonenumberType } from '~/model/data/PhonenumberType'
import { Relationship } from '~/model/data/Relationship'
import { RWStatus } from '~/model/data/RWStatus'
import { Salutation } from '~/model/data/Salutation'
import { Socialmedia } from '~/model/data/Socialmedia'
import { SocialmediaType } from '~/model/data/SocialmediaType'
import { Title } from '~/model/data/Title'
import { Zip } from '~/model/data/Zip'
import { CompetenceField } from '~/model/projectreference/CompetenceField'
import { Complexity } from '~/model/projectreference/Complexity'
import { Industry } from '~/model/projectreference/Industry'
import { Projectreference } from '~/model/projectreference/Projectreference'
import { ResponsibleArea } from '~/model/projectreference/ResponsibleArea'
import { Role } from '~/model/projectreference/Role'
import { Design } from '~/model/system/Design'
import { User } from '~/model/system/User'
import { Document } from '~/model/system/Document'

export class ObjectFactory {
  private static typeMap = {
    address: Address,
    category: Category,
    company: Company,
    contact: Contact,
    country: Country,
    county: County,
    email: Email,
    email_type: EmailType,
    gender: Gender,
    phonenumber: Phonenumber,
    phonenumber_line: PhonenumberLine,
    phonenumber_type: PhonenumberType,
    relationship: Relationship,
    rwstatus: RWStatus,
    salutation: Salutation,
    socialmedia: Socialmedia,
    socialmedia_type: SocialmediaType,
    title: Title,
    zip: Zip,
    companyWithLocation: CompanyWithLocation,

    design: Design,
    document: Document,
    user: User,

    projectreference: Projectreference,
    competence_field: CompetenceField,
    complexity: Complexity,
    industry: Industry,
    responsible_area: ResponsibleArea,
    role: Role,
  }

  private static realTypeMap = {
    Address: Address,
    Category: Category,
    Company: Company,
    Contact: Contact,
    Country: Country,
    County: County,
    Email: Email,
    EmailType: EmailType,
    Gender: Gender,
    Phonenumber: Phonenumber,
    PhonenumberLine: PhonenumberLine,
    PhonenumberType: PhonenumberType,
    Relationship: Relationship,
    RWStatus: RWStatus,
    Salutation: Salutation,
    Socialmedia: Socialmedia,
    SocialmediaType: SocialmediaType,
    Title: Title,
    Zip: Zip,
    CompanyWithLocation: CompanyWithLocation,

    Design: Design,
    Document: Document,
    User: User,

    Projectreference: Projectreference,
    CompetenceField: CompetenceField,
    Complexity: Complexity,
    Industry: Industry,
    ResponsibleArea: ResponsibleArea,
    Role: Role,
  }

  public static create<T>(name: string, ...args: any[]): T {
    return new this.realTypeMap[name](...args)
  }

  public static createFromName<T>(name: string, ...args: any[]): T {
    return new this.typeMap[name](...args)
  }
}
