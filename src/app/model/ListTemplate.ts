export default class ListTemplate {
  name: string
  config: IListTemplateConfig

  constructor(name: string, config: IListTemplateConfig) {
    this.name = name
    this.config = config
  }
}

interface IListTemplateConfig {
  visibleColumns: any
  filters: any
}
