import ICompany from '~/interfaces/data/ICompany'
import IContact from '~/interfaces/data/IContact'
import ICompetenceField from '~/interfaces/projectreference/ICompetenceField'
import IComplexity from '~/interfaces/projectreference/IComplexity'
import IIndustry from '~/interfaces/projectreference/IIndustry'
import IProjectreference from '~/interfaces/projectreference/IProjectreference'
import IResponsibleArea from '~/interfaces/projectreference/IResponsibleArea'
import IRole from '~/interfaces/projectreference/IRole'
import IDocument from '~/interfaces/system/IDocument'
import Company from '../data/Company'
import Contact from '../data/Contact'
import Document from '../system/Document'
import Table from '../extend/Table'
import CompetenceField from './CompetenceField'
import Complexity from './Complexity'
import Industry from './Industry'
import ResponsibleArea from './ResponsibleArea'
import Role from './Role'
import InputTextComponent, {
  EInputType,
} from '~/components/form/input-text/input-text'
import InputMultipleComponent from '~/components/form/multiple/multiple'
import InputSelectComponent from '~/components/form/input-select/input-select'
import InputDateComponent from '~/components/form/input-date/input-date'
import InputDocumentSelectorComponent from '~/components/form/input-document-selector/input-document-selector'

export default class Projectreference
  extends Table
  implements IProjectreference {
  id?: number
  projectname?: string
  uniquename?: string
  content?: string
  teaser?: string
  keywords?: string[]
  targets?: string[]
  client?: ICompany
  reference_person?: IContact
  start_date?: number
  end_date?: number
  function?: string
  roles?: IRole[]
  load?: string
  complexity?: IComplexity
  strategic?: string
  novelty?: string
  complexity_string?: string
  risk?: string
  potential?: string
  budget?: string
  industries?: IIndustry[]
  responsible_areas?: IResponsibleArea[]
  responsible_areas_text?: string
  competence_fields?: ICompetenceField[]
  attachements?: IDocument[]
  main_image?: IDocument
  images?: IDocument[]

  constructor(data: IProjectreference = {}) {
    super(data as any)
    this.id = data.id ? data.id : undefined
    this.projectname = data.projectname ? data.projectname : undefined
    this.uniquename = data.uniquename ? data.uniquename : undefined
    this.content = data.content ? data.content : undefined
    this.teaser = data.teaser ? data.teaser : undefined
    this.keywords = data.keywords ? data.keywords : undefined
    this.targets = data.targets ? data.targets : undefined
    this.client = data.client ? new Company(data.client) : undefined
    this.reference_person = data.reference_person
      ? new Contact(data.reference_person)
      : undefined
    this.start_date = data.start_date ? data.start_date : undefined
    this.end_date = data.end_date ? data.end_date : undefined
    this.function = data.function ? data.function : undefined
    this.roles = []
    if (data.roles) {
      data.roles.forEach((companyWithLocation: IRole) => {
        this.roles.push(new Role(companyWithLocation))
      })
    }
    this.load = data.load ? data.load : undefined
    this.complexity = data.complexity
      ? new Complexity(data.complexity)
      : undefined
    this.strategic = data.strategic ? data.strategic : undefined
    this.novelty = data.novelty ? data.novelty : undefined
    this.complexity_string = data.complexity_string
      ? data.complexity_string
      : undefined
    this.risk = data.risk ? data.risk : undefined
    this.potential = data.potential ? data.potential : undefined
    this.budget = data.budget ? data.budget : undefined
    this.industries = []
    if (data.industries) {
      data.industries.forEach((industry: IIndustry) => {
        this.industries.push(new Industry(industry))
      })
    }
    this.responsible_areas = []
    if (data.responsible_areas) {
      data.responsible_areas.forEach((responsible_area: IResponsibleArea) => {
        this.responsible_areas.push(new ResponsibleArea(responsible_area))
      })
    }
    this.responsible_areas_text = data.responsible_areas_text
      ? data.responsible_areas_text
      : undefined
    this.competence_fields = []
    if (data.competence_fields) {
      data.competence_fields.forEach((competence_field: ICompetenceField) => {
        this.competence_fields.push(new CompetenceField(competence_field))
      })
    }
    this.attachements = []
    if (data.attachements) {
      data.attachements.forEach((attachement: IDocument) => {
        this.attachements.push(new Document(attachement))
      })
    }
    this.main_image = data.main_image
      ? new Document(data.main_image)
      : undefined
    this.images = []
    if (data.images) {
      data.images.forEach((image: IDocument) => {
        this.images.push(new Document(image))
      })
    }
  }

  public getId(): number {
    return this.id
  }

  public toString(): string {
    return this.projectname
  }

  public validate(): boolean {
    this.fieldProjectname.classList.toggle('error', !this.projectname)
    return !!this.projectname
  }

  private fieldProjectname: InputTextComponent

  public async getField(): Promise<any> {
    this.fieldProjectname = new InputTextComponent(
      (value: string) => (this.projectname = value),
      EInputType.TEXT,
      this.projectname,
      undefined,
      true
    )

    return {
      projectname: this.fieldProjectname,
      uniquename: new InputTextComponent(
        (value: string) => (this.uniquename = value),
        EInputType.TEXT,
        this.uniquename
      ),
      content: new InputTextComponent(
        (value: string) => (this.content = value),
        EInputType.TEXT,
        this.content
      ),
      teaser: new InputTextComponent(
        (value: string) => (this.teaser = value),
        EInputType.TEXT,
        this.teaser
      ),
      keywords: new InputMultipleComponent(
        (value: string[]) => (this.keywords = value),
        this.keywords,
        () => ''
      ),
      targets: new InputMultipleComponent(
        (value: string[]) => (this.targets = value),
        this.targets,
        () => ''
      ),
      client: new InputSelectComponent(
        (value: Company) => (this.client = value),
        await Company.getSelectMap(),
        this.client ? this.client.id : undefined
      ),
      reference_person: new InputSelectComponent(
        (value: Contact) => (this.reference_person = value),
        await Contact.getSelectMap(),
        this.reference_person ? this.reference_person.id : undefined
      ),
      start_date: new InputDateComponent(
        (value: number) => (this.start_date = value),
        this.start_date
      ),
      end_date: new InputDateComponent(
        (value: number) => (this.end_date = value),
        this.end_date
      ),
      function: new InputTextComponent(
        (value: string) => (this.function = value),
        EInputType.TEXT,
        this.function
      ),
      roles: new InputMultipleComponent(
        (value: Role[]) => (this.roles = value),
        this.roles,
        () => new Role(),
        true
      ),
      load: new InputTextComponent(
        (value: string) => (this.load = value),
        EInputType.TEXT,
        this.load
      ),
      complexity: new InputSelectComponent(
        (value: Complexity) => (this.complexity = value),
        await Complexity.getSelectMap('data', 'complexity'),
        this.complexity ? this.complexity.uniquename : undefined
      ),
      complexity_string: new InputTextComponent(
        (value: string) => (this.complexity_string = value),
        EInputType.TEXT,
        this.complexity_string
      ),
      strategic: new InputTextComponent(
        (value: string) => (this.strategic = value),
        EInputType.TEXT,
        this.strategic
      ),
      novelty: new InputTextComponent(
        (value: string) => (this.novelty = value),
        EInputType.TEXT,
        this.novelty
      ),
      risk: new InputTextComponent(
        (value: string) => (this.risk = value),
        EInputType.TEXT,
        this.risk
      ),
      potential: new InputTextComponent(
        (value: string) => (this.potential = value),
        EInputType.TEXT,
        this.potential
      ),
      budget: new InputTextComponent(
        (value: string) => (this.budget = value),
        EInputType.TEXT,
        this.budget
      ),
      industries: new InputMultipleComponent(
        (value: Industry[]) => (this.industries = value),
        this.industries,
        () => new Industry(),
        true
      ),
      responsible_areas: new InputMultipleComponent(
        (value: ResponsibleArea[]) => (this.responsible_areas = value),
        this.responsible_areas,
        () => new ResponsibleArea(),
        true
      ),
      responsible_areas_text: new InputTextComponent(
        (value: string) => (this.responsible_areas_text = value),
        EInputType.TEXT,
        this.responsible_areas_text
      ),
      competence_fields: new InputMultipleComponent(
        (value: CompetenceField[]) => (this.competence_fields = value),
        this.competence_fields,
        () => new CompetenceField(),
        true
      ),
      attachements: new InputMultipleComponent(
        (value: Document[]) => (this.attachements = value),
        this.attachements,
        () => new Document(),
        true
      ),
      main_image: new InputDocumentSelectorComponent(
        (value: Document) => (this.main_image = value),
        this.main_image
      ),
      images: new InputMultipleComponent(
        (value: Document[]) => (this.images = value),
        this.images,
        () => new Document(),
        true
      ),
    }
  }
}
