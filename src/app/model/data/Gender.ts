import IKeyValue from '~/interfaces/extend/IKeyValue'
import { KeyValue } from '../extend/KeyValue'

export class Gender extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }
}
