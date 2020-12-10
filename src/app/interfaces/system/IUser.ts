import Design from '~/model/Design'
import Document from '~/model/Document'

export default abstract class IUser {
  abstract id?: number
  abstract issuperuser?: boolean
  abstract username?: string
  abstract givenname?: string
  abstract surname?: string
  abstract email?: string
  abstract image?: Document
  abstract password?: string
  abstract configuration?: string
  abstract design?: Design
  abstract color?: string
}
