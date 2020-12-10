import BaseComponent from '~/baseComponent'
import ButtonComponent from '../button/button'
import tmpl from './confirmation.html'

export default class ConfirmationComponent extends BaseComponent {
  paragraph: HTMLParagraphElement = this.querySelector('p')
  buttons: HTMLDivElement = this.querySelector('.buttons')

  constructor(text: string, buttons: IConfirmationButtonConfig[] = []) {
    super(tmpl)

    this.paragraph.innerText = text

    buttons.reverse().forEach((buttonConfig) => {
      const button = new ButtonComponent(buttonConfig.title)
      button.setAttribute('classes', buttonConfig.color)
      button.addEventListener('button-click', buttonConfig.click)
      this.buttons.appendChild(button)
    })
  }
}

interface IConfirmationButtonConfig {
  title: string
  color: string
  click: () => void
}
