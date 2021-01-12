import InputSelectComponent from '~/components/form/input-select/input-select'
import ModalComponent from '~/components/modal/modal'
import EditContent from '~/contents/edit/edit'

function getModal(
  key: string,
  select: InputSelectComponent,
  type: any,
  value: any,
  objKey: string,
  identifier: string
): ModalComponent {
  const modal = new ModalComponent(
    new EditContent(true, [key, value], async (val) => {
      select.update(
        await type.getSelectMap('data', key),
        val ? val[identifier] : undefined
      )
      this[objKey ? objKey : key] = val
      modal.close()
      modal.setContent(
        new EditContent(
          true,
          [key, val ? val[identifier] : undefined],
          async (val2) => {
            select.update(
              await type.getSelectMap('data', key),
              val2[identifier]
            )
            this[objKey ? objKey : key] = val2
            modal.close()
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
  return modal
}

export async function getSelect(
  key: string,
  value: any,
  type: any,
  identifier: string,
  objKey: string
): Promise<InputSelectComponent> {
  let sel: InputSelectComponent = undefined

  const openModal: ModalComponent = getModal.call(
    this,
    key,
    sel,
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
    },
    await type.getSelectMap('data', key),
    value,
    undefined,
    () =>
      getModal.call(this, key, sel, type, undefined, objKey, identifier).open(),
    undefined,
    () => openModal.open()
  )
  sel.toggleViewButton(!!value)

  return sel
}
