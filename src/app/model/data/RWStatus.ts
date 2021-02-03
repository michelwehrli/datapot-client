import IKeyValue from '~/interfaces/extend/IKeyValue'
import { KeyValue } from '../extend/KeyValue'

export class RWStatus extends KeyValue {
  constructor(data: IKeyValue = {}) {
    super(data as any)
  }
}
