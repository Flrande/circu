import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import UnderlineIcon from "./UnderlineIcon"

const UnderlineButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isActive = isMarkActive(editor, "underline")

  const onClick = () => {
    toggleMark(editor, "underline", true)
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("underline")
  }

  return (
    <ToolBarItem isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <UnderlineIcon></UnderlineIcon>
    </ToolBarItem>
  )
}

export default UnderlineButton
