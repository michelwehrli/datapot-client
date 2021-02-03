import InputSelectComponent from '~/components/form/input-select/input-select'
import ModalComponent from '~/components/modal/modal'
import EditContent from '~/contents/edit/edit'

function getModal(
  key: string,
  getSel: () => InputSelectComponent,
  type: any,
  value: any,
  objKey: string,
  identifier: string,
  modalToUse?: ModalComponent
): ModalComponent {
  const modal = new ModalComponent(
    new EditContent(true, [key, value], async (val) => {
      getSel().update(
        await type.getSelectMap('data', objKey ? objKey : key),
        val[identifier]
      )
      this[objKey ? objKey : key] = val
      modal.close()
      ;(modalToUse ? modalToUse : modal).setContent(
        new EditContent(
          true,
          [key, val ? val[identifier] : undefined],
          async (val2) => {
            getSel().update(
              await type.getSelectMap('data', key),
              val2[identifier]
            )
            this[objKey ? objKey : key] = val2
            ;(modalToUse ? modalToUse : modal).close()
          }
        )
      )
    }),
    undefined,
    undefined,
    undefined,
    true,
    true
  )
  modal.setAttribute(
    'mid',
    Math.floor(Math.random() * Math.floor(100000)).toString()
  )
  return modal
}

export async function getSelect(
  key: string,
  value: any,
  type: any,
  identifier: string,
  objKey: string,
  changeCallback?: (val: any) => void,
  required = false
): Promise<InputSelectComponent> {
  let sel: InputSelectComponent = undefined

  const openModal: ModalComponent = getModal.call(
    this,
    key,
    (): InputSelectComponent => {
      return sel
    },
    type,
    value,
    objKey,
    identifier
  )
  sel = new InputSelectComponent(
    (val) => {
      this[objKey ? objKey : key] = val
      sel.toggleViewButton(!!val)
      openModal.setContent(
        new EditContent(
          true,
          [key, val ? val[identifier] : undefined],
          async (val2) => {
            sel.update(
              await type.getSelectMap('data', key),
              val2 ? val2[identifier] : undefined
            )
            this[objKey ? objKey : key] = val2
            openModal.close()
          }
        )
      )
      if (typeof changeCallback === 'function') {
        changeCallback(val)
      }
    },
    await type.getSelectMap('data', key),
    value,
    required,
    () =>
      getModal
        .call(this, key, sel, type, undefined, objKey, identifier, openModal)
        .open(),
    undefined,
    () => openModal.open()
  )
  sel.toggleViewButton(!!value)

  return sel
}
