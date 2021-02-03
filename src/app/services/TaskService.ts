import ButtonComponent from '~/components/button/button'
import ConfirmationComponent from '~/components/confirmation/confirmation'
import ModalComponent from '~/components/modal/modal'
import ToastComponent from '~/components/toast/toast'
import { EToastType, HttpService, ToastService } from '~/internal'

export class TaskService {
  private static isInited = false
  private static configs: ITaskObject[] = [
    {
      name: 'office-365-export',
      title: 'Office 365 Export',
      description: 'Alle Kontakt- und Firmendaten ins Office 365 exportieren.',
      isAsync: true,
    },
    {
      name: 'csv-export',
      title: 'Kontakte herunterladen',
      description:
        'Alle Kontakte als CSV-Datei herunterladen. Die Daten haben die selbe Struktur wie das Ursprungs-Excel-File.',
      buttonText: 'Herunterladen',
    },
    {
      name: 'ftp-backup',
      title: 'Datenbank sichern',
      description: 'Die Datenbank auf den remote FTP-Server sichern.',
      isAsync: true,
      noProgressBar: true,
    },
  ]
  private static tasks: TaskObject[] = []

  public static init(): void {
    if (this.isInited) {
      return
    }
    this.isInited = true

    this.configs.forEach((config) => {
      this.tasks.push(new TaskObject(config))
    })
  }

  public static setTbody(tbodyE: HTMLElement): void {
    this.tasks.forEach((e) => {
      e.setTbody(tbodyE)
    })
  }
}

class TaskObject {
  performButton: ButtonComponent
  asyncButton: ButtonComponent = new ButtonComponent()
  progressE: HTMLProgressElement
  progressTextE: HTMLSpanElement
  running: boolean
  aborted: boolean
  loggedin: boolean
  pollingTimeout: NodeJS.Timer
  taskToast: ToastComponent

  tbodyE: HTMLElement

  constructor(private config: ITaskObject) {
    this.performButton = new ButtonComponent(config.buttonText)
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
            true,
            true
          )
          this.poll()

          if (!this.config.noProgressBar) {
            this.asyncButton.setAttribute('disabled', 'false')
          }
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
      if (this.performButton) {
        this.performButton.addEventListener('button-click', async () => {
          const result = await HttpService.get(
            `task/${this.config.name}/open`,
            true,
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
  }

  private switchButton() {
    if (this.running) {
      this.asyncButton.setAttribute(
        'text',
        this.config.noProgressBar ? 'Bitte warten...' : 'Stop'
      )
      this.asyncButton.setAttribute('classes', 'negative')
    } else if (!this.loggedin) {
      this.asyncButton.setAttribute('text', 'Bei Microsoft anmelden')
      this.asyncButton.setAttribute('classes', 'neutral')
    } else {
      this.asyncButton.setAttribute('disabled', 'false')
      this.asyncButton.setAttribute('text', 'Start')
      this.asyncButton.setAttribute('classes', 'positive')
    }
  }

  private async poll() {
    const currentStatus = await HttpService.get(
      `task/${this.config.name}/status`,
      true,
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

      if (!this.taskToast) {
        this.taskToast = ToastService.add(
          `Task "${this.config.title}" läuft...${
            currentStatus.data.statusText
              ? '\n' + currentStatus.data.statusText
              : ''
          }`,
          EToastType.INFO
        )
      } else {
        this.taskToast.setText(
          `Task "${this.config.title}" läuft...${
            currentStatus.data.statusText
              ? '\n' + currentStatus.data.statusText
              : ''
          }`
        )
      }
    } else {
      if (this.taskToast) {
        ToastService.remove(this.taskToast)
        this.taskToast = undefined
      }

      if (wasRunning && this.aborted) {
        ToastService.add(
          `Du hast den Task "${this.config.title}" abgebrochen und es konnten nicht alle Aufgaben abgeschlossen werden. Ein kompletter Import bereinigt die Daten.`,
          EToastType.NEGATIVE,
          8000
        )
      } else if (wasRunning) {
        const modal = new ModalComponent(
          new ConfirmationComponent(
            currentStatus.data.metrics.replace('[[title]]', this.config.title),
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
      if (!this.config.noProgressBar) {
        tdProgressE.appendChild(divE)
      }
      tdFunctionsE.appendChild(this.asyncButton)
    } else {
      tdFunctionsE.appendChild(this.performButton)
    }
    const trE = document.createElement('tr')
    trE.appendChild(tdNameE)
    trE.appendChild(tdProgressE)
    trE.appendChild(tdFunctionsE)
    this.tbodyE.appendChild(trE)
  }
}

interface ITaskObject {
  name: string
  title: string
  description: string
  isAsync?: boolean
  buttonText?: string
  noProgressBar?: boolean
}
