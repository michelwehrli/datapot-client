import InputSelectComponent from '~/components/form/input-select/input-select'
import ModalComponent from '~/components/modal/modal'
import EditContent from '~/contents/edit/edit'

function getModal(
  key: string,
  select: InputSelectComponent,
  type: any,
  value: any
): ModalComponent {
  const modal = new ModalComponent(
    new EditContent(
      true,
      [key],
      async (value) => {
        select.update(await type.getSelectMap('data', key), value)
        this[key] = value
        modal.close()
      },
      value
    ),
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
  identifier: string
): Promise<InputSelectComponent> {
  let sel: InputSelectComponent = undefined

  let openModal: ModalComponent = getModal(key, sel, type, value)
  sel = new InputSelectComponent(
    (val) => {
      this[key] = val
      sel.toggleViewButton(!!val)
      openModal = getModal(key, sel, type, val[identifier])
    },
    await type.getSelectMap('data', key),
    value,
    undefined,
    () => openModal.open(),
    undefined,
    () => openModal.open()
  )
  sel.toggleViewButton(!!value)

  return sel
}
