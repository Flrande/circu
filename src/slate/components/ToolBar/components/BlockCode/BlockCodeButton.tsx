import { useSlateStatic } from "slate-react"
import { isBlockCodeActive, toggleBlockCode } from "../../../Nodes/Block/BlockCode/blockCodeHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import BlockCodeIcon from "./BlockCodeIcon"

const BlockCodeButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isBlockCodeActive(editor)
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
    <ToolBarItem isStyleActive={isActive} onMouseDown={onMouseDown}>
      <BlockCodeIcon></BlockCodeIcon>
    </ToolBarItem>
  )
}

export default BlockCodeButton
