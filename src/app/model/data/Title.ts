import IKeyValue from '~/interfaces/extend/IKeyValue'
import KeyValue from '../extend/KeyValue'

export default class Title extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }
}
