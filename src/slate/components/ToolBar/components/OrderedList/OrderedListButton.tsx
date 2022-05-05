import { useSlate } from "slate-react"
import { isListActive, toggleOrderedList } from "../../../Nodes/Block/List/listHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import OrderedListIcon from "./OrderedListIcon"

const OrderedListButton: React.FC = () => {
  const editor = useSlate()
  const isActive = isListActive(editor, "orderedList")
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleOrderedList(editor)
    }
  }

  return (
    <ToolBarItem isStyleActive={isActive} onMouseDown={onMouseDown}>
      <OrderedListIcon></OrderedListIcon>
    </ToolBarItem>
  )
}

export default OrderedListButton
