import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isMarkActive, toggleMark } from "../../../Nodes/Text/textHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import StrikeIcon from "./StrikeIcon"

const StrikeButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isStrikeActive = isMarkActive(editor, "strike")

  const onClick = () => {
    toggleMark(editor, "strike", true)
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("strike")
  }

  return (
    <ToolBarItem isStyleActive={isStrikeActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <StrikeIcon></StrikeIcon>
    </ToolBarItem>
  )
}

export default StrikeButton
