import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isBlockCodeActive, toggleBlockCode } from "../../../Nodes/Block/BlockCode/blockCodeHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import BlockCodeIcon from "./BlockCodeIcon"

const BlockCodeButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
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
  const onMouseEnter = () => {
    setActiveButton("block-code")
  }

  return (
    <ToolBarItem isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <BlockCodeIcon></BlockCodeIcon>
    </ToolBarItem>
  )
}

export default BlockCodeButton
