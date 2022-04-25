import { useAtom } from "jotai"
import { useSlate } from "slate-react"
import { isLinkActive } from "../../../Nodes/Inline/Link/linkHelper"
import { toolBarStateAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import { linkButtonBarStateAtom } from "./LinkButtonBar"
import LinkIcon from "./LinkIcon"

const LinkButton: React.FC = () => {
  const editor = useSlate()
  const isActive = isLinkActive(editor)

  const [, setToolBarState] = useAtom(toolBarStateAtom)
  const [, setLinkButtonState] = useAtom(linkButtonBarStateAtom)

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const sel = window.getSelection()
    if (!sel) {
      console.error("onMouseDown in LinkButton need dom selection.")
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
  }

  return (
    <ToolBarItem isStyleActive={isActive} onMouseDown={onMouseDown}>
      <LinkIcon></LinkIcon>
    </ToolBarItem>
  )
}

export default LinkButton
