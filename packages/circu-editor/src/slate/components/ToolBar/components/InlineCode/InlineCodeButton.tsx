import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isInlineCodeActive, toggleInlineCode } from "../../../Nodes/Inline/InlineCode/inlineCodeHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import InlineCodeIcon from "./InlineCodeIcon"

const InlineCodeButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isActive = isInlineCodeActive(editor)

  const onClick = () => {
    if (editor.selection) {
      toggleInlineCode(editor)
    }
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("inline-code")
  }

  return (
    <ToolBarItem styleMessage={"代码"} isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <InlineCodeIcon></InlineCodeIcon>
    </ToolBarItem>
  )
}

export default InlineCodeButton
