import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import BoldIcon from "./BoldIcon"

const BoldButton: React.FC = () => {
  const editor = useSlateStatic()
  const isBoldActive = isMarkActive(editor, "bold")
  const onClick = () => {
    toggleMark(editor, "bold", true)
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isBoldActive} onClick={onClick}>
      <BoldIcon></BoldIcon>
    </ToolBarItem>
  )
}

export default BoldButton
