import { ReactEditor, useSlate } from "slate-react"
import { isInlineCodeActive, toggleInlineCode } from "../../../Nodes/Inline/InlineCode/inlineCodeHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import InlineCodeIcon from "./InlineCodeIcon"

const InlineCodeButton: React.FC = () => {
  const editor = useSlate()
  const isActive = isInlineCodeActive(editor)
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleInlineCode(editor)
      ReactEditor.focus(editor)
    }
  }

  return (
    <ToolBarItem isStyleActive={isActive} onMouseDown={onMouseDown}>
      <InlineCodeIcon></InlineCodeIcon>
    </ToolBarItem>
  )
}

export default InlineCodeButton
