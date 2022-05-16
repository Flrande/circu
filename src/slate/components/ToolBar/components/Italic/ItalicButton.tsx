import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import ItalicIcon from "./ItalicIcon"

const ItalicButton: React.FC = () => {
  const editor = useSlateStatic()
  const isItalicActive = isMarkActive(editor, "italic")
  const onClick = () => {
    toggleMark(editor, "italic", true)
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isItalicActive} onClick={onClick}>
      <ItalicIcon></ItalicIcon>
    </ToolBarItem>
  )
}

export default ItalicButton
