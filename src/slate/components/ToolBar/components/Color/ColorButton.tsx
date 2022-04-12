import { useAtom } from "jotai"
import { useState } from "react"
import { ReactEditor, useSlate } from "slate-react"
import { backgroundColorMap, fontColorMap } from "../../../Nodes/Text/Color"
import { toggleColorMark } from "../../../Nodes/Text/colorHelper"
import { toolBarButton, toolBarButtonSvg, toolBarItemContainer } from "../../ToolBar.css"
import { toolBarIconBackgroundColor } from "../ToolBarItem/useIconColor"
import ColorIcon from "./ColorIcon"
import { selectedColorAtom } from "./state"

const ColorButton: React.FC = () => {
  const editor = useSlate()
  const [isMouseenter, setIsMouseenter] = useState(false)
  const [colorState, setColorState] = useAtom(selectedColorAtom)
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (colorState.fontColorKey) {
      toggleColorMark(editor, "font", colorState.fontColorKey)
    }
    if (colorState.backgroundColorKey) {
      toggleColorMark(editor, "background", colorState.backgroundColorKey)
    }
    ReactEditor.focus(editor)
  }

  return (
    <div>
      <div className={toolBarItemContainer}>
        <div
          onMouseDown={onMouseDown}
          onMouseEnter={() => {
            setIsMouseenter(true)
          }}
          onMouseLeave={() => {
            setIsMouseenter(false)
          }}
          className={toolBarButton}
          style={{
            backgroundColor: isMouseenter ? toolBarIconBackgroundColor.focusStatic : undefined,
          }}
        >
          <div
            className={toolBarButtonSvg}
            style={{
              backgroundColor: backgroundColorMap[colorState.backgroundColorKey],
              // 设计上这应该是离 icon svg 最近的一个 color,
              // 否则 svg 中的 currentColor 会导致颜色与预期不符
              color: colorState.fontColorKey ? fontColorMap[colorState.fontColorKey] : "#ffffff",
            }}
          >
            <ColorIcon></ColorIcon>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorButton
