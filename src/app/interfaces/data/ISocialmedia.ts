import SocialmediaType from '~/model/data/SocialmediaType'

export default abstract class ISocialmedia {
  abstract id?: number
  abstract url?: string
  abstract type?: SocialmediaType
}
