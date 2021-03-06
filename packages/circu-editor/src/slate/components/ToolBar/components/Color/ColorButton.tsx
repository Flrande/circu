import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { backgroundColorMap, fontColorMap } from "../../../Nodes/Text/Color"
import { toggleColorMark } from "../../../Nodes/Text/colorHelper"
import { activeButtonAtom } from "../../state"
import { toolBarIconBackgroundColor } from "../ToolBarItem/useIconColor"
import ColorBar from "./ColorBar"
import ColorIcon from "./ColorIcon"
import { buttonColorAtom, isColorBarActiveAtom, selectedColorAtom } from "./state"

const ColorButton: React.FC = () => {
  const editor = useSlateStatic()
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  const buttonColor = useAtomValue(buttonColorAtom)
  const selectedColor = useAtomValue(selectedColorAtom)
  const setIsColorBarActive = useSetAtom(isColorBarActiveAtom)
  const setActiveButton = useSetAtom(activeButtonAtom)

  const onClick = () => {
    if (selectedColor.fontColorKey) {
      toggleColorMark(editor, "font", selectedColor.fontColorKey)
    }
    if (selectedColor.backgroundColorKey) {
      toggleColorMark(editor, "background", selectedColor.backgroundColorKey)
    }
    ReactEditor.focus(editor)
  }

  return (
    <div
      onMouseLeave={() => {
        setIsColorBarActive(false)
      }}
      className={"py-2 px-1"}
    >
      <div
        onClick={onClick}
        onMouseEnter={() => {
          setIsMouseEnter(true)
          setIsColorBarActive(true)
          setActiveButton("color")
        }}
        onMouseLeave={() => {
          setIsMouseEnter(false)
        }}
        className={"flex items-center justify-center h-8 w-8 rounded-md cursor-pointer"}
        style={{
          backgroundColor: isMouseEnter ? toolBarIconBackgroundColor.focusStatic : undefined,
        }}
      >
        <div
          className={"h-6 w-6"}
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
