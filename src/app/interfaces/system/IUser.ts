import IDesign from './IDesign'
import IDocument from './IDocument'

export default abstract class IUser {
  abstract id?: number
  abstract issuperuser?: boolean
  abstract username?: string
  abstract givenname?: string
  abstract surname?: string
  abstract email?: string
  abstract image?: IDocument
  abstract password?: string
  abstract configuration?: string
  abstract design?: IDesign
  abstract color?: string
}
