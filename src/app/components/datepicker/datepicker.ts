import BaseComponent from '~/baseComponent'
import ButtonComponent from '~/components/button/button'
import tmpl from './datepicker.html'

export default class DatepickerComponent extends BaseComponent {
  prevButton: HTMLElement = this.querySelector('.js-prev-month')
  nextButton: HTMLElement = this.querySelector('.js-next-month')
  monthButton: HTMLElement = this.querySelector('.js-month-button')
  yearButton: HTMLElement = this.querySelector('.js-year-button')
  dayContainer: HTMLElement = this.querySelector('.js-container-day')
  dayContainerInner: HTMLElement = this.dayContainer.querySelector('.inner')
  monthContainer: HTMLElement = this.querySelector('.js-container-month')
  yearContainer: HTMLElement = this.querySelector('.js-container-year')
  yearContainerInner: HTMLElement = this.yearContainer.querySelector('.inner')
  backButton: HTMLElement = this.querySelector('.back')

  currentDate: Date

  static get observedAttributes(): string[] {
    return ['date']
  }

  constructor(date?: number) {
    super(tmpl)

    if (date) {
      this.currentDate = new Date(date)
    } else {
      this.currentDate = new Date()
    }

    this.currentDate.setHours(0)
    this.currentDate.setMinutes(0)
    this.currentDate.setSeconds(0)

    this.prevButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      this.update()
    })

    this.nextButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      this.update()
    })

    // März geht nicht! 28/29

    this.monthButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.dayContainer.classList.add('hidden')
      this.monthContainer.classList.remove('hidden')
      this.yearContainer.classList.add('hidden')
      this.nextButton.classList.add('hidden')
      this.prevButton.classList.add('hidden')
    })
    this.yearButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.dayContainer.classList.add('hidden')
      this.monthContainer.classList.add('hidden')
      this.yearContainer.classList.remove('hidden')
      this.nextButton.classList.add('hidden')
      this.prevButton.classList.add('hidden')
    })

    this.backButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.dayContainer.classList.remove('hidden')
      this.monthContainer.classList.add('hidden')
      this.yearContainer.classList.add('hidden')
      this.nextButton.classList.remove('hidden')
      this.prevButton.classList.remove('hidden')
    })

    if (!this.hasAttribute('date')) {
      this.update()
    }
  }

  public getValue(): Date {
    return this.currentDate
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'date') {
      this.currentDate = new Date(parseInt(newValue))
      this.update()
    }
  }

  private update(): void {
    this.dayContainerInner.innerHTML = ''

    this.yearButton.setAttribute(
      'text',
      this.currentDate.getFullYear().toString()
    )

    this.monthButton.setAttribute(
      'text',
      EMonthNames[this.currentDate.getMonth()]
    )

    const minusAMonth: Date = new Date(this.currentDate.getDate())
    minusAMonth.setMonth(this.currentDate.getMonth() - 1)

    this.generateDayArray(
      this.getDayOfDate(this.getFirstDateOfMonth(this.currentDate)),
      this.getDayCountInMonth(this.currentDate),
      this.getDayCountInMonth(minusAMonth)
    )
  }

  private generateDayArray(
    startDay: number,
    dayCountInMonth: number,
    previousDayCountInMonth: number
  ) {
    const currentDay: number = this.currentDate.getDate()
    const dayMap: any[] = []
    let preDisabledCounter = 0
    startDay++
    if (startDay === 1) {
      for (let i = 0; i < 7; i++) {
        dayMap.push({
          disabled: true,
        })
        preDisabledCounter++
      }
    }
    for (let i = 1; i < dayCountInMonth + startDay; i++) {
      if (i < startDay) {
        dayMap.push({
          disabled: true,
        })
        preDisabledCounter++
      } else {
        dayMap.push({
          day: i - startDay + 1,
          active: currentDay === i - startDay + 1,
          disabled: false,
        })
      }
    }
    let count = 0
    for (let i = dayMap.length; i < 42; i++) {
      count++
      dayMap.push({
        day: count,
        disabled: true,
      })
    }
    for (let i = preDisabledCounter - 1; i >= 0; i--) {
      dayMap[i].day = previousDayCountInMonth + i - preDisabledCounter + 1
    }

    const chunked: any[] = this.chunkArray(dayMap, 7)
    chunked.forEach((chunk: any[]) => {
      const rowE: HTMLElement = document.createElement('div')
      rowE.classList.add('row')

      chunk.forEach((item) => {
        const btnE: ButtonComponent = new ButtonComponent()
        btnE.setAttribute('disabled', item.disabled)
        if (!item.disabled) {
          btnE.setAttribute('text', item.day)
        }
        if (!item.disabled) {
          btnE.addEventListener('click', (e) => {
            e.preventDefault()
            this.currentDate.setDate(item.day)
            this.update()
            this.dispatchEvent(new Event('changed'))
          })
          if (item.active) {
            btnE.classList.add('active')
          }
        }
        rowE.appendChild(btnE)
      })

      this.dayContainerInner.appendChild(rowE)
    })

    this.yearContainerInner.innerHTML = ''

    const year: number = this.currentDate.getFullYear()
    const yearArray: number[] = []
    for (let i = year - 4; i <= year + 4; i++) {
      yearArray.push(i)
    }
    const yearChunked: any[] = this.chunkArray(yearArray, 3)
    yearChunked.forEach((chunk) => {
      const rowE: HTMLElement = document.createElement('div')
      rowE.classList.add('row')

      chunk.forEach((year) => {
        const btnE: ButtonComponent = new ButtonComponent()
        btnE.setAttribute('text', year)
        btnE.addEventListener('click', (e) => {
          e.preventDefault()
          this.currentDate.setFullYear(year)
          this.update()
        })
        if (year === this.currentDate.getFullYear()) {
          btnE.classList.add('active')
        }
        rowE.appendChild(btnE)
      })

      this.yearContainerInner.appendChild(rowE)
    })

    this.monthContainer.innerHTML = ''
    const months: string[] = [
      'Jan',
      'Feb',
      'Mär',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dez',
    ]
    const monthChunks: any[] = this.chunkArray(months, 3)

    monthChunks.forEach((chunk) => {
      const rowE: HTMLElement = document.createElement('div')
      rowE.classList.add('row')

      chunk.forEach((month) => {
        const btnE: ButtonComponent = new ButtonComponent()
        btnE.setAttribute('text', month)
        btnE.addEventListener('click', (e) => {
          e.preventDefault()
          this.currentDate.setMonth(parseInt(EShortMonthToIndex[month]))
          this.update()

          this.dayContainer.classList.remove('hidden')
          this.monthContainer.classList.add('hidden')
          this.yearContainer.classList.add('hidden')
          this.nextButton.classList.remove('hidden')
          this.prevButton.classList.remove('hidden')
        })
        if (
          parseInt(EShortMonthToIndex[month]) === this.currentDate.getMonth()
        ) {
          btnE.classList.add('active')
        }
        rowE.appendChild(btnE)
      })

      this.monthContainer.appendChild(rowE)
    })
  }

  private getFirstDateOfMonth(date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  private getDayOfDate(date: Date): number {
    return EDay[date.getDay()]
  }

  private getDayCountInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  private chunkArray(arr: any[], size: number) {
    let index = 0
    const arrayLength: number = arr.length
    const tempArray: any[] = []
    for (index = 0; index < arrayLength; index += size) {
      const chunk = arr.slice(index, index + size)
      tempArray.push(chunk)
    }
    return tempArray
  }
}

const EDay: Map<number, number> = new Map()
EDay[0] = 6
EDay[1] = 0
EDay[2] = 1
EDay[3] = 2
EDay[4] = 3
EDay[5] = 4
EDay[6] = 5

const EMonthNames: Map<number, string> = new Map()
EMonthNames[0] = 'Januar'
EMonthNames[1] = 'Februar'
EMonthNames[2] = 'März'
EMonthNames[3] = 'April'
EMonthNames[4] = 'Mai'
EMonthNames[5] = 'Juni'
EMonthNames[6] = 'Juli'
EMonthNames[7] = 'August'
EMonthNames[8] = 'September'
EMonthNames[9] = 'Oktober'
EMonthNames[10] = 'November'
EMonthNames[11] = 'Dezember'

enum EShortMonthToIndex {
  'Jan' = 0,
  'Feb' = 1,
  'Mär' = 2,
  'Apr' = 3,
  'Mai' = 4,
  'Jun' = 5,
  'Jul' = 6,
  'Aug' = 7,
  'Sep' = 8,
  'Okt' = 9,
  'Nov' = 10,
  'Dez' = 11,
}
