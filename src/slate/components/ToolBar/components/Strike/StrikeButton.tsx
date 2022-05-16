import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import StrikeIcon from "./StrikeIcon"

const StrikeButton: React.FC = () => {
  const editor = useSlateStatic()
  const isStrikeActive = isMarkActive(editor, "strike")
  const onClick = () => {
    toggleMark(editor, "strike", true)
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isStrikeActive} onClick={onClick}>
      <StrikeIcon></StrikeIcon>
    </ToolBarItem>
  )
}

export default StrikeButton
