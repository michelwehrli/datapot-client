import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ContentHeaderComponent from '~/components/content-header/content-header'
import DataService from '~/services/DataService'
import { Router } from '~/services/Router'
import TitleService from '~/services/TitleService'
import tmpl from './list.html'

export default class ListContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )

  constructor() {
    super(tmpl)

    const params: string[] = Router.getParams()
    if (params && params[0]) {
      const table: string = params[0]
      const datamodel = DataService.getDatamodel(table)

      if (!datamodel) {
        return
      }

      this.contentHeader.setAttribute('title', datamodel.__meta.titlePlural)
      this.contentHeader.setAttribute('icon', datamodel.__meta.icon)

      TitleService.setTitle(datamodel.__meta.titlePlural)

      const newButton: ButtonComponent = new ButtonComponent(
        'Neuer Eintrag',
        'fa fa-plus',
        'positive'
      )

      this.contentHeader.addButtons(newButton)

      newButton.addEventListener('click', () => {
        Router.navigate(`crm/edit/${table}`, 'crm')
      })
    }
  }
}
