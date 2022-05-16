import { ReactEditor, useSlateStatic } from "slate-react"
import { isInlineCodeActive, toggleInlineCode } from "../../../Nodes/Inline/InlineCode/inlineCodeHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import InlineCodeIcon from "./InlineCodeIcon"

const InlineCodeButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isInlineCodeActive(editor)
  const onClick = () => {
    if (editor.selection) {
      toggleInlineCode(editor)
    }
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isActive} onClick={onClick}>
      <InlineCodeIcon></InlineCodeIcon>
    </ToolBarItem>
  )
}

export default InlineCodeButton
