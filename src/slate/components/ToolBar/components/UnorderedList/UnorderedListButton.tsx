import { useSlate } from "slate-react"
import { isListActive, toggleUnorderedList } from "../../../Nodes/Block/List/listHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import UnorderedListIcon from "./UnorderedListIcon"

const UnorderedListButton: React.FC = () => {
  const editor = useSlate()
  const isActive = isListActive(editor, "unorderedList")
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleUnorderedList(editor)
    }
  }

  return (
    <ToolBarItem isStyleActive={isActive} onMouseDown={onMouseDown}>
      <UnorderedListIcon></UnorderedListIcon>
    </ToolBarItem>
  )
}

export default UnorderedListButton
