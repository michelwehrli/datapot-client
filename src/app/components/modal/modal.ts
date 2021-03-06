import BaseComponent from '~/baseComponent'
import ButtonComponent from '../button/button'
import tmpl from './modal.html'

export default class ModalComponent extends BaseComponent {
  modalContainer: HTMLDivElement = document.querySelector('.modal-container')
  inner: HTMLDivElement = this.querySelector('.inner')
  header: HTMLDivElement = this.querySelector('.header')
  content: HTMLDivElement = this.querySelector('.content')
  i: HTMLElement = this.querySelector('i')
  span: HTMLSpanElement = this.querySelector('span')
  closeButton: ButtonComponent = this.querySelector('dp-button')
  childComponent: any

  constructor(
    childComponent: any,
    title?: string,
    icon?: string,
    isSmall?: boolean,
    isBig?: boolean,
    initiallyClosed = false
  ) {
    super(tmpl)

    this.childComponent = childComponent

    if (title) {
      this.span.innerText = title
    }
    if (icon) {
      icon.split(' ').forEach((c) => {
        this.i.classList.add(c)
      })
    }
    if (isSmall) {
      this.classList.add('small')
    }
    if (isBig) {
      this.classList.add('big')
    }
    if (!icon) {
      this.i.classList.add('hidden')
    }

    if (!initiallyClosed) {
      this.open()
    }
  }

  public setContent(childComponent: any): void {
    this.childComponent = childComponent
    this.content.innerHTML = ''
  }

  public open(): void {
    this.closeButton.addEventListener('button-click', () => this.close())
    this.modalContainer.appendChild(this)
    this.content.appendChild(this.childComponent)
  }

  public close(): void {
    this.closeButton.removeEventListener('button-click', () => this.close())
    if (this.modalContainer.contains(this)) {
      this.modalContainer.removeChild(this)
    }
  }
}
