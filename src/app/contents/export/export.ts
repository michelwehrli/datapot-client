import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ContentHeaderComponent from '~/components/content-header/content-header'
import ModalComponent from '~/components/modal/modal'
import ToastComponent from '~/components/toast/toast'
import HttpService from '~/services/HttpService'
import TitleService from '~/services/TitleService'
import { EToastType, ToastService } from '~/services/ToastService'
import tmpl from './export.html'

export default class ExportContent extends BaseComponent {
  contentHeader: ContentHeaderComponent = this.querySelector(
    'dp-content-header'
  )
  tbodyE: HTMLElement = this.querySelector('[data-element=tbody]')
  exports: IExportObject[] = [
    {
      name: 'office-365-export',
      title: 'Office 365',
      description: 'Alle Kontaktdaten ins Office 365 exportieren.',
      isAsync: true,
    },
    {
      name: 'excel-export',
      title: 'Excel-Datei',
      description: 'Alle Daten als Excel-Datei herunterladen.',
    },
  ]

  constructor() {
    super(tmpl)

    this.contentHeader.setAttribute('title', 'Export')
    this.contentHeader.setAttribute('icon', 'fa fa-file-export')
    TitleService.setTitle('Export')

    for (const exportConfig of this.exports) {
      new ExportObject(exportConfig, this.tbodyE)
    }
  }
}

interface IExportObject {
  name: string
  title: string
  description: string
  isAsync?: boolean
}

class ExportObject {
  downloadButton: ButtonComponent = new ButtonComponent('Herunterladen')
  asyncButton: ButtonComponent = new ButtonComponent()
  progressE: HTMLProgressElement
  progressTextE: HTMLSpanElement
  running: boolean
  aborted: boolean
  loggedin: boolean
  pollingTimeout: NodeJS.Timer
  exportToast: ToastComponent

  constructor(private config: IExportObject, private tbodyE: HTMLElement) {
    this.createItem()
    this.init()
  }

  private async init() {
    if (this.config.isAsync) {
      this.poll()
      this.asyncButton.addEventListener('button-click', async () => {
        this.asyncButton.setAttribute('disabled', 'true')
        this.asyncButton.setAttribute('text', 'Startet...')
        const result = await HttpService.get(
          `task/${this.config.name}/${
            !this.loggedin ? 'login' : this.running ? 'stop' : 'start'
          }`,
          true
        )
        this.poll()

        this.asyncButton.setAttribute('disabled', 'false')
        if (result && result.data) {
          if (result.data.redirectTo) {
            window.location.href = result.data.redirectTo
          }
        }
        if (this.running) {
          this.aborted = true
        }
      })
    } else {
      this.downloadButton.addEventListener('button-click', async () => {
        const result = await HttpService.get(
          `task/${this.config.name}/start`,
          true
        )
        if (result && result.data) {
          if (result.data.url) {
            window.open(result.data.url)
          }
        }
      })
    }
  }

  private switchButton() {
    if (this.running) {
      this.asyncButton.setAttribute('text', 'Stop')
      this.asyncButton.setAttribute('classes', 'negative')
    } else if (!this.loggedin) {
      this.asyncButton.setAttribute('text', 'Bei Microsoft anmelden')
      this.asyncButton.setAttribute('classes', 'neutral')
    } else {
      this.asyncButton.setAttribute('text', 'Start')
      this.asyncButton.setAttribute('classes', 'positive')
    }
  }

  private async poll() {
    const currentStatus = await HttpService.get(
      `task/${this.config.name}/status`,
      true
    )

    if (currentStatus.errorCode === 51) {
      this.loggedin = false
    } else {
      this.loggedin = true
    }

    let wasRunning = false
    if (this.running) {
      wasRunning = true
    }

    if (currentStatus.data) {
      this.running = currentStatus.data.running
      this.progressE.value = currentStatus.data.progress
      this.progressTextE.innerText = currentStatus.data.statusText || ''
    }

    this.switchButton()

    if (this.running) {
      this.pollingTimeout = setTimeout(() => this.poll(), 500)

      if (!this.exportToast) {
        this.exportToast = ToastService.add(
          `Export ${this.config.title} läuft...`,
          EToastType.INFO
        )
      }
    } else {
      if (this.exportToast) {
        ToastService.remove(this.exportToast)
      }

      if (wasRunning && this.aborted) {
        ToastService.add(
          `Du hast den Export "${this.config.title}" abgebrochen.`,
          EToastType.NEGATIVE,
          3000
        )
      } else if (wasRunning) {
        const modal = new ModalComponent(
          new ConfirmationComponent(
            `Der Export "${this.config.title}" wurde erfolgreich abgeschlossen. Hier die Zusammenfassung:\n\nÜbersprungen: ${currentStatus.data.metrics.skipped}\nHinzugefügt: ${currentStatus.data.metrics.added}\nAktualisiert: ${currentStatus.data.metrics.updated}\nEntfernt: ${currentStatus.data.metrics.deleted}\nFehler: ${currentStatus.data.metrics.errored}\n\nKontakte auf dem Server: ${currentStatus.data.metrics.serverCount}\nKontakte auf Office 365: ${currentStatus.data.metrics.o365Count}`,
            [
              {
                title: 'Okay',
                color: 'neutral',
                click: () => {
                  modal.close()
                },
              },
            ]
          ),
          undefined,
          undefined,
          true
        )
      }
      this.aborted = false
      this.progressE.value = 0
    }
  }

  private createItem() {
    const titleE = document.createElement('strong')
    titleE.innerText = this.config.title
    const descriptionE = document.createElement('p')
    descriptionE.innerText = this.config.description
    const tdNameE = document.createElement('td')
    tdNameE.appendChild(titleE)
    tdNameE.appendChild(descriptionE)
    const tdProgressE = document.createElement('td')
    const tdFunctionsE = document.createElement('td')
    if (this.config.isAsync) {
      const divE = document.createElement('div')
      divE.classList.add('progress-wrapper')
      this.progressE = document.createElement('progress')
      this.progressE.max = 100
      this.progressE.value = 0
      divE.appendChild(this.progressE)
      this.progressTextE = document.createElement('span')
      divE.appendChild(this.progressTextE)
      tdProgressE.appendChild(divE)
      tdFunctionsE.appendChild(this.asyncButton)
    } else {
      tdFunctionsE.appendChild(this.downloadButton)
    }
    const trE = document.createElement('tr')
    trE.appendChild(tdNameE)
    trE.appendChild(tdProgressE)
    trE.appendChild(tdFunctionsE)
    this.tbodyE.appendChild(trE)
  }
}
