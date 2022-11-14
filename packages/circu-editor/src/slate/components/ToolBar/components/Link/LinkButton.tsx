import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { DOC_WIDTH, EDITOR_ROOT_DOM_ID } from "../../../../types/constant"
import { isLinkActive } from "../../../Nodes/Inline/Link/linkHelper"
import { activeButtonAtom, toolBarStateStore } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import { linkButtonBarStateAtom } from "./LinkButtonBar"
import LinkIcon from "./LinkIcon"

//TODO: 点击按钮时维持蓝区
const LinkButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isLinkActive(editor)

  const setLinkButtonState = useSetAtom(linkButtonBarStateAtom)
  const setActiveButton = useSetAtom(activeButtonAtom)

  const onClick = () => {
    const sel = window.getSelection()
    if (!sel) {
      return
    }
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    // 文档左右两边到视口的距离
    const docXPadding = (document.getElementById(EDITOR_ROOT_DOM_ID)!.clientWidth - DOC_WIDTH) / 2
    const left = rect.left - docXPadding - document.getElementById(EDITOR_ROOT_DOM_ID)!.getBoundingClientRect().left
    const top = rect.top + 30 + window.scrollY

    toolBarStateStore.isActive = false
    toolBarStateStore.position = null
    setLinkButtonState({
      isActive: true,
      position: {
        left,
        top,
      },
    })

    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("link")
  }

  return (
    <ToolBarItem styleMessage={"链接"} isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <LinkIcon></LinkIcon>
    </ToolBarItem>
  )
}

export default LinkButton
