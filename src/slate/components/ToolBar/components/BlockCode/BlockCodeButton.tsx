import { useSlate } from "slate-react"
import { toggleBlockCode } from "../../../Nodes/Block/BlockCode/blockCodeHelper"
import BlockCodeIcon from "./BlockCodeIcon"

const BlockCodeButton: React.FC = () => {
  const editor = useSlate()
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleBlockCode(editor)
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      })
      window.getSelection()?.anchorNode?.parentElement?.dispatchEvent(event)
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
          <BlockCodeIcon></BlockCodeIcon>
        </div>
      </div>
    </div>
  )
}

export default BlockCodeButton
