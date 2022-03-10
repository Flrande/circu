import { useAtom } from "jotai"
import type React from "react"
import { ReactEditor, useSlate } from "slate-react"
import { isMouseUpAtom } from "../../state/mouse"
import { toggleInlineCode } from "../Inline/InlineCode/codeWorker"
import { toggleMark } from "../Text/TextWorker"
import type { IconTypes } from "./icons/types"
import BoldIcon from "./icons/BoldIcon"
import InlineCodeIcon from "./icons/InlineCodeIcon"
import { toolBar, toolBarContainer } from "./ToolBar.css"

const useToolBarHandlers = () => {
  const editor = useSlate()

  const boldHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "bold")
    ReactEditor.focus(editor)
  }

  const inlineCodeHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleInlineCode(editor)
      ReactEditor.focus(editor)
    }
  }

  return {
    boldHandler,
    inlineCodeHandler,
  }
}

const ToolBarItem: React.FC<{
  // 利用标称类型限制 IconComponent 的类型
  IconComponent: IconTypes
  onMouseDown?: React.MouseEventHandler
}> = ({ IconComponent, onMouseDown }) => {
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
          <IconComponent></IconComponent>
        </div>
      </div>
    </div>
  )
}

const ToolBar: React.FC = () => {
  const { boldHandler, inlineCodeHandler } = useToolBarHandlers()
  const [isMouseUp] = useAtom(isMouseUpAtom)

  const nativeSelection = window.getSelection()
  const isToolBarActive = !!(isMouseUp && nativeSelection && !nativeSelection.isCollapsed)

  if (isToolBarActive) {
    const selectedRange = nativeSelection.getRangeAt(0)

    const topDistance = window.scrollY + selectedRange.getBoundingClientRect().top
    const leftDistance = window.scrollX + selectedRange.getBoundingClientRect().left

    const toolBarStyle: React.CSSProperties = {
      transform: `${topDistance > 80 ? "translate3d(0, -10px, 0px)" : "translate3d(0, 10px, 0px)"} `,
      opacity: "1",
      transitionProperty: "opacity, transform",
      transitionDuration: "0.3s, 0.3s",
      transitionDelay: "0.017s, 0.017s",
      top: `${topDistance > 80 ? topDistance - 40 : topDistance + 20}px`,
      left: `${leftDistance}px`,
      userSelect: "none",
    }

    return (
      <div className={toolBarContainer} style={toolBarStyle}>
        <div style={{ display: "inline-block" }}>
          <ul className={toolBar}>
            <ToolBarItem IconComponent={BoldIcon} onMouseDown={boldHandler}></ToolBarItem>
            <ToolBarItem IconComponent={InlineCodeIcon} onMouseDown={inlineCodeHandler}></ToolBarItem>
          </ul>
        </div>
      </div>
    )
  } else {
    return <div style={{ opacity: "0" }}></div>
  }
}

export default ToolBar
