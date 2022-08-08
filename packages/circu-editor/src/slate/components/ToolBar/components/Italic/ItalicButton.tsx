import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import ItalicIcon from "./ItalicIcon"

const ItalicButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isItalicActive = isMarkActive(editor, "italic")

  const onClick = () => {
    toggleMark(editor, "italic", true)
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("italic")
  }

  return (
    <ToolBarItem
      styleMessage={"斜体"}
      shortcutMessage={"Markdown: *文字* 空格"}
      isStyleActive={isItalicActive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <ItalicIcon></ItalicIcon>
    </ToolBarItem>
  )
}

export default ItalicButton
