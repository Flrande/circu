import { ReactEditor, useSlate } from "slate-react"
import { toggleMark } from "../../../Nodes/Text/textHelper"
import BoldIcon from "../../icons/BoldIcon"

const BoldButton: React.FC = () => {
  const editor = useSlate()
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "bold", true)
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
          <BoldIcon></BoldIcon>
        </div>
      </div>
    </div>
  )
}

export default BoldButton
