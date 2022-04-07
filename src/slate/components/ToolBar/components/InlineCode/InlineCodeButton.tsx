import { ReactEditor, useSlate } from "slate-react"
import { toggleInlineCode } from "../../../Nodes/Inline/InlineCode/inlineCodeHelper"
import InlineCodeIcon from "../../icons/InlineCodeIcon"

const InlineCodeButton: React.FC = () => {
  const editor = useSlate()
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleInlineCode(editor)
      ReactEditor.focus(editor)
    }
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
          <InlineCodeIcon></InlineCodeIcon>
        </div>
      </div>
    </div>
  )
}

export default InlineCodeButton
