import { useSlate, ReactEditor } from "slate-react"
import { toggleMark } from "../../../Nodes/Text/textHelper"
import StrikeIcon from "../../icons/StrikeIcon"

const StrikeButton: React.FC = () => {
  const editor = useSlate()
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "strike", true)
    ReactEditor.focus(editor)
  }

  return (
    <div>
      <div
        style={{
          padding: "8px 4px",
        }}
      >
        <div
          style={{
            height: "24px",
            width: "24px",
          }}
          onMouseDown={onMouseDown}
        >
          <StrikeIcon></StrikeIcon>
        </div>
      </div>
    </div>
  )
}

export default StrikeButton
