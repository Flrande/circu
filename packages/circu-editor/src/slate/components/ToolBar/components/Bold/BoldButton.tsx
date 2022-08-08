import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import BoldIcon from "./BoldIcon"

const BoldButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isBoldActive = isMarkActive(editor, "bold")

  const onClick = () => {
    toggleMark(editor, "bold", true)
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("bold")
  }

  return (
    <ToolBarItem
      styleMessage={"粗体"}
      shortcutMessage={"Markdown: **文字** 空格"}
      isStyleActive={isBoldActive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <BoldIcon></BoldIcon>
    </ToolBarItem>
  )
}

export default BoldButton
