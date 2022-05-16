import { ReactEditor, useSlateStatic } from "slate-react"
import { isListActive, toggleOrderedList } from "../../../Nodes/Block/List/listHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import OrderedListIcon from "./OrderedListIcon"

const OrderedListButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isListActive(editor, "orderedList")
  const onClick = () => {
    if (editor.selection) {
      toggleOrderedList(editor)
    }
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isActive} onClick={onClick}>
      <OrderedListIcon></OrderedListIcon>
    </ToolBarItem>
  )
}

export default OrderedListButton
