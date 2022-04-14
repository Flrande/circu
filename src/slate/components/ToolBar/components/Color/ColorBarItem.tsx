import { useAtom } from "jotai"
import { useState } from "react"
import { useSlate } from "slate-react"
import type { KeysUnion } from "../../../../types/utils"
import { backgroundColorMap, fontColorMap, IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"
import { isColorMarkActive, toggleColorMark } from "../../../Nodes/Text/colorHelper"
import ColorIcon from "./ColorIcon"
import { selectedColorAtom } from "./state"

const ColorBarItem = <T extends "font" | "background">({
  type,
  colorKey,
}: {
  type: T
  colorKey: T extends "font" ? Exclude<KeysUnion<IFontColorMap>, "initialWhite"> : KeysUnion<IBackgroundColorMap>
}) => {
  const editor = useSlate()
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom)
  const isActive = isColorMarkActive(editor, type, colorKey)

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (type === "font") {
      toggleColorMark(editor, "font", colorKey as Exclude<KeysUnion<IFontColorMap>, "initialWhite">)
      setSelectedColor({
        ...selectedColor,
        fontColorKey: colorKey as Exclude<KeysUnion<IFontColorMap>, "initialWhite">,
      })
    } else {
      toggleColorMark(editor, "background", colorKey as KeysUnion<IBackgroundColorMap>)
      setSelectedColor({
        ...selectedColor,
        backgroundColorKey: colorKey as KeysUnion<IBackgroundColorMap>,
      })
    }
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => {
        setIsMouseEnter(true)
      }}
      onMouseLeave={() => {
        setIsMouseEnter(false)
      }}
      style={{
        cursor: "pointer",
        boxSizing: "border-box",
        width: "14.2857%",
        maxWidth: "26px",
        height: "26px",
        borderRadius: "2px",
        margin: "2px 2px 4px 2px",
        border: isActive ? "2px solid #5a87f7" : isMouseEnter ? "2px solid #273d74" : "2px solid #363636",
        backgroundColor:
          type === "background" ? backgroundColorMap[colorKey as KeysUnion<IBackgroundColorMap>] : undefined,
        color:
          type === "font"
            ? fontColorMap[colorKey as Exclude<KeysUnion<IFontColorMap>, "initialWhite">]
            : fontColorMap.initialWhite,
      }}
    >
      <ColorIcon></ColorIcon>
    </div>
  )
}

export default ColorBarItem
