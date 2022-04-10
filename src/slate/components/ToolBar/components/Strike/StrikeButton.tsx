import { useSlate, ReactEditor } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import StrikeIcon from "./StrikeIcon"

const StrikeButton: React.FC = () => {
  const editor = useSlate()
  const isStrikeActive = isMarkActive(editor, "strike")
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "strike", true)
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isStrikeActive} onMouseDown={onMouseDown}>
      <StrikeIcon></StrikeIcon>
    </ToolBarItem>
  )
}

export default StrikeButton
