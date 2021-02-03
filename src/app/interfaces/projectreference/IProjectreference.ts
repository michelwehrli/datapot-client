import { Company } from '~/model/data/Company'
import { Contact } from '~/model/data/Contact'
import { CompetenceField } from '~/model/projectreference/CompetenceField'
import { Complexity } from '~/model/projectreference/Complexity'
import { Industry } from '~/model/projectreference/Industry'
import { ResponsibleArea } from '~/model/projectreference/ResponsibleArea'
import { Role } from '~/model/projectreference/Role'
import { Document } from '~/model/system/Document'

export default abstract class IProjectreference {
  abstract id?: number
  abstract projectname?: string
  abstract uniquename?: string
  abstract content?: string
  abstract teaser?: string
  abstract keywords?: string[]
  abstract targets?: string[]
  abstract client?: Company
  abstract reference_person?: Contact
  abstract start_date?: number
  abstract end_date?: number
  abstract function?: string
  abstract roles?: Role[]
  // abstract involved_employees?: Collection<Employee> | IEmployee[]
  // abstract services?: Collection<Service> | IService[]
  abstract load?: string
  abstract complexity?: Complexity
  abstract strategic?: string
  abstract novelty?: string
  abstract complexity_string?: string
  abstract risk?: string
  abstract potential?: string
  abstract budget?: string
  abstract industries?: Industry[]
  abstract responsible_areas?: ResponsibleArea[]
  abstract responsible_areas_text?: string
  abstract competence_fields?: CompetenceField[]
  abstract attachements?: Document[]
  abstract main_image?: Document
  abstract images?: Document[]
}
