import ToastComponent from '~/components/toast/toast'

export class ToastService {
  public static toastContainer: HTMLDivElement

  public static init(toastContainer: HTMLDivElement): void {
    this.toastContainer = toastContainer
  }

  public static add(
    text: string,
    type: EToastType,
    timeoutMs?: number
  ): ToastComponent {
    const toast = new ToastComponent(text, type)
    toast.addEventListener('click', () => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    })
    setTimeout(() => {
      toast.classList.add('visible')
    }, 0)
    this.toastContainer.appendChild(toast)
    if (timeoutMs) {
      setTimeout(() => {
        toast.classList.remove('visible')
        setTimeout(() => {
          if (toast.parentNode) {
            if (toast && toast.parentNode) {
              toast.parentNode.removeChild(toast)
            }
          }
        }, 200)
      }, timeoutMs)
    }
    return toast
  }

  public static remove(toast: ToastComponent): void {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }
}

export enum EToastType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  INFO = 'info',
}
