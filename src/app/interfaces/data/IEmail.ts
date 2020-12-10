import EmailType from '~/model/data/EmailType'

export default abstract class IEmail {
  abstract id?: number
  abstract address?: string
  abstract type?: EmailType
}
