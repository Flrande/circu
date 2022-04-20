import { useAtom, useAtomValue } from "jotai"
import { useState } from "react"
import { useSlate } from "slate-react"
import { backgroundColorMap, fontColorMap } from "../../../Nodes/Text/Color"
import { toggleColorMark } from "../../../Nodes/Text/colorHelper"
import { toolBarButton, toolBarButtonSvg, toolBarItemContainer } from "../../ToolBar.css"
import { toolBarIconBackgroundColor } from "../ToolBarItem/useIconColor"
import ColorBar from "./ColorBar"
import ColorIcon from "./ColorIcon"
import { buttonColorAtom, isColorBarActiveAtom, selectedColorAtom } from "./state"

const ColorButton: React.FC = () => {
  const editor = useSlate()
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  const buttonColor = useAtomValue(buttonColorAtom)
  const selectedColor = useAtomValue(selectedColorAtom)
  const [, setIsColorBarActive] = useAtom(isColorBarActiveAtom)

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (selectedColor.fontColorKey) {
      toggleColorMark(editor, "font", selectedColor.fontColorKey)
    }
    if (selectedColor.backgroundColorKey) {
      toggleColorMark(editor, "background", selectedColor.backgroundColorKey)
    }
  }

  return (
    <div
      onMouseLeave={() => {
        setIsColorBarActive(false)
      }}
      className={toolBarItemContainer}
    >
      <div
        onMouseDown={onMouseDown}
        onMouseEnter={() => {
          setIsMouseEnter(true)
          setIsColorBarActive(true)
        }}
        onMouseLeave={() => {
          setIsMouseEnter(false)
        }}
        className={toolBarButton}
        style={{
          backgroundColor: isMouseEnter ? toolBarIconBackgroundColor.focusStatic : undefined,
        }}
      >
        <div
          className={toolBarButtonSvg}
          style={{
            backgroundColor: backgroundColorMap[buttonColor.backgroundColorKey],
            // 设计上这应该是离 icon svg 最近的一个 color,
            // 否则 svg 中的 currentColor 会导致颜色与预期不符
            color: fontColorMap[buttonColor.fontColorKey],
          }}
        >
          <ColorIcon></ColorIcon>
        </div>
      </div>
      <ColorBar></ColorBar>
    </div>
  )
}

export default ColorButton
