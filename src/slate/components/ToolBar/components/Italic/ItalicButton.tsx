import { useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import ItalicIcon from "./ItalicIcon"

const ItalicButton: React.FC = () => {
  const editor = useSlateStatic()
  const isItalicActive = isMarkActive(editor, "italic")
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "italic", true)
  }

  return (
    <ToolBarItem isStyleActive={isItalicActive} onMouseDown={onMouseDown}>
      <ItalicIcon></ItalicIcon>
    </ToolBarItem>
  )
}

export default ItalicButton
