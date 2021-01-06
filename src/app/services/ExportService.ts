import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ModalComponent from '~/components/modal/modal'
import ToastComponent from '~/components/toast/toast'

import HttpService from './HttpService'
import { EToastType, ToastService } from './ToastService'

export default class ExportService {
  private static isInited = false
  private static configs: IExportObject[] = [
    {
      name: 'office-365-export',
      title: 'Office 365',
      description: 'Alle Kontakt- und Firmendaten ins Office 365 exportieren.',
      isAsync: true,
    },
    {
      name: 'csv-export',
      title: 'Kontakte herunterladen',
      description:
        'Alle Kontakte als CSV-Datei herunterladen. Die Daten haben die selbe Struktur wie das Ursprungs-Excel-File.',
    },
  ]
  private static exports: ExportObject[] = []

  public static init(): void {
    if (this.isInited) {
      return
    }
    this.isInited = true

    this.configs.forEach((config) => {
      this.exports.push(new ExportObject(config))
    })
  }

  public static setTbody(tbodyE: HTMLElement): void {
    this.exports.forEach((e) => {
      e.setTbody(tbodyE)
    })
  }
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

  tbodyE: HTMLElement

  constructor(private config: IExportObject) {
    this.init()
  }

  public setTbody(tbodyE: HTMLElement) {
    this.tbodyE = tbodyE
    this.createItem()
  }

  private async init() {
    if (this.config.isAsync) {
      this.poll()
      if (this.asyncButton) {
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
      }
    } else {
      if (this.downloadButton) {
        this.downloadButton.addEventListener('button-click', async () => {
          const result = await HttpService.get(
            `task/${this.config.name}/open`,
            true
          )
          console.log(result)
          if (result && result.data) {
            if (result.data.url) {
              window.open(result.data.url)
            }
          }
        })
      }
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
      if (this.progressE) {
        this.progressE.value = currentStatus.data.progress
      }
      if (this.progressTextE) {
        this.progressTextE.innerText = currentStatus.data.statusText || ''
      }
    }

    this.switchButton()

    if (this.running) {
      this.pollingTimeout = setTimeout(() => this.poll(), 500)

      if (!this.exportToast) {
        this.exportToast = ToastService.add(
          `Export "${this.config.title}" läuft...${
            currentStatus.data.statusText
              ? '\n' + currentStatus.data.statusText
              : ''
          }`,
          EToastType.INFO
        )
      } else {
        this.exportToast.setText(
          `Export "${this.config.title}" läuft...${
            currentStatus.data.statusText
              ? '\n' + currentStatus.data.statusText
              : ''
          }`
        )
      }
    } else {
      if (this.exportToast) {
        ToastService.remove(this.exportToast)
        this.exportToast = undefined
      }

      if (wasRunning && this.aborted) {
        ToastService.add(
          `Du hast den Export "${this.config.title}" abgebrochen und es konnten nicht alle Aufgaben abgeschlossen werden. Ein kompletter Import bereinigt die Daten.`,
          EToastType.NEGATIVE,
          8000
        )
      } else if (wasRunning) {
        const modal = new ModalComponent(
          new ConfirmationComponent(
            `Der Export "${this.config.title}" wurde erfolgreich abgeschlossen. Hier die Zusammenfassung:\n\nUnverändert: ${currentStatus.data.metrics.skipped}\nHinzugefügt: ${currentStatus.data.metrics.added}\nAktualisiert: ${currentStatus.data.metrics.updated}\nEntfernt: ${currentStatus.data.metrics.deleted}\nFehler: ${currentStatus.data.metrics.errored}\n\nKontakte im Datapot: ${currentStatus.data.metrics.serverCount}\nKontakte auf Office 365: ${currentStatus.data.metrics.o365Count}`,
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
      if (this.progressE) {
        this.progressE.value = 0
      }
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

export interface IExportObject {
  name: string
  title: string
  description: string
  isAsync?: boolean
}
