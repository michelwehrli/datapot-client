import BaseComponent from '~/baseComponent'
import { EToastType } from '~/services/ToastService'
import tmpl from './toast.html'

export default class ToastComponent extends BaseComponent {
  constructor(text: string, type: EToastType) {
    super(tmpl)

    this.classList.add(type)
    this.querySelector('p').innerText = text
  }
}
