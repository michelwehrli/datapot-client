export default abstract class IKeyValue {
  abstract uniquename?: string
  abstract label?: string

  abstract validate?(): boolean
}
