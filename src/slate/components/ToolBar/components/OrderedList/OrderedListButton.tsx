import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isListActive, toggleOrderedList } from "../../../Nodes/Block/List/listHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import OrderedListIcon from "./OrderedListIcon"

const OrderedListButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isActive = isListActive(editor, "ordered-list")

  const onClick = () => {
    if (editor.selection) {
      toggleOrderedList(editor)
    }
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("ordered-list")
  }

  return (
    <ToolBarItem isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <OrderedListIcon></OrderedListIcon>
    </ToolBarItem>
  )
}

export default OrderedListButton
