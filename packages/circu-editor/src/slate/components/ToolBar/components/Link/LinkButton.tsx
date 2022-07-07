import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isLinkActive } from "../../../Nodes/Inline/Link/linkHelper"
import { activeButtonAtom, toolBarStateAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import { linkButtonBarStateAtom } from "./LinkButtonBar"
import LinkIcon from "./LinkIcon"

//TODO: 点击按钮时维持蓝区
const LinkButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isLinkActive(editor)

  const setToolBarState = useSetAtom(toolBarStateAtom)
  const setLinkButtonState = useSetAtom(linkButtonBarStateAtom)
  const setActiveButton = useSetAtom(activeButtonAtom)

  const onClick = () => {
    const sel = window.getSelection()
    if (!sel) {
      return
    }
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    // 文档左右两边到视口的距离, 790 为文档宽度
    const docXPadding = (document.documentElement.clientWidth - 790) / 2
    const left = rect.left - docXPadding
    const top = rect.top + 30 + window.scrollY

    setToolBarState({
      isActive: false,
      position: null,
    })
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
    <ToolBarItem isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <LinkIcon></LinkIcon>
    </ToolBarItem>
  )
}

export default LinkButton
