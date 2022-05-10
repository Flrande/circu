import { useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import BoldIcon from "./BoldIcon"

const BoldButton: React.FC = () => {
  const editor = useSlateStatic()
  const isBoldActive = isMarkActive(editor, "bold")
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "bold", true)
  }

  return (
    <ToolBarItem isStyleActive={isBoldActive} onMouseDown={onMouseDown}>
      <BoldIcon></BoldIcon>
    </ToolBarItem>
  )
}

export default BoldButton
