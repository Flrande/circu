import { ReactEditor, useSlateStatic } from "slate-react"
import { isBlockCodeActive, toggleBlockCode } from "../../../Nodes/Block/BlockCode/blockCodeHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import BlockCodeIcon from "./BlockCodeIcon"

const BlockCodeButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isBlockCodeActive(editor)
  const onClick = () => {
    if (editor.selection) {
      toggleBlockCode(editor)
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      })
      window.getSelection()?.anchorNode?.parentElement?.dispatchEvent(event)
    }
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem isStyleActive={isActive} onClick={onClick}>
      <BlockCodeIcon></BlockCodeIcon>
    </ToolBarItem>
  )
}

export default BlockCodeButton
