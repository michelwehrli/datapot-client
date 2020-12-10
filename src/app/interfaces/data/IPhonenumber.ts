import PhonenumberLine from '~/model/data/PhonenumberLine'
import PhonenumberType from '~/model/data/PhonenumberType'

export default abstract class IPhonenumber {
  abstract id?: number
  abstract number?: string
  abstract type?: PhonenumberType
  abstract line?: PhonenumberLine
}
