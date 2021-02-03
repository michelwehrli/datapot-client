export class Table implements ITable {
  _creation_date: number
  _modification_date: number

  constructor(data: ITable = {}) {
    this._creation_date = data._creation_date ? data._creation_date : undefined
    this._modification_date = data._modification_date
      ? data._modification_date
      : undefined
  }
}
