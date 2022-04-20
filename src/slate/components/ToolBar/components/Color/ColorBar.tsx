import { useAtomValue } from "jotai"
import { useState } from "react"
import { useSlate } from "slate-react"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"
import { cleanColorMark } from "../../../Nodes/Text/colorHelper"
import { colorBar, colorBarCleanButton, colorBarContainer, colorBarItemContainer, colorBarText } from "./ColorBar.css"
import ColorBarItem from "./ColorBarItem"
import { isColorBarActiveAtom } from "./state"

const ColorBar: React.FC = () => {
  const fontList: Array<{
    type: "font"
    color: Exclude<KeysUnion<IFontColorMap>, "initialWhite">
  }> = [
    {
      type: "font",
      color: "red",
    },
    {
      type: "font",
      color: "orange",
    },
    {
      type: "font",
      color: "yellow",
    },
    {
      type: "font",
      color: "lime",
    },
    {
      type: "font",
      color: "blue",
    },
    {
      type: "font",
      color: "pinkPurple",
    },
    {
      type: "font",
      color: "gray",
    },
  ]
  const backgroundList: Array<{
    type: "background"
    color: KeysUnion<IBackgroundColorMap>
  }> = [
    {
      type: "background",
      color: "red_1",
    },
    {
      type: "background",
      color: "red_2",
    },
    {
      type: "background",
      color: "orange_1",
    },
    {
      type: "background",
      color: "orange_2",
    },
    {
      type: "background",
      color: "yellow_1",
    },
    {
      type: "background",
      color: "yellow_2",
    },
    {
      type: "background",
      color: "lime_1",
    },
    {
      type: "background",
      color: "lime_2",
    },
    {
      type: "background",
      color: "blue_1",
    },
    {
      type: "background",
      color: "blue_2",
    },
    {
      type: "background",
      color: "pinkPurple_1",
    },
    {
      type: "background",
      color: "pinkPurple_2",
    },
    {
      type: "background",
      color: "gray_1",
    },
    {
      type: "background",
      color: "gray_2",
    },
  ]
  const editor = useSlate()
  const isColorBarActive = useAtomValue(isColorBarActiveAtom)

  const onCleanButtonDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    cleanColorMark(editor)
  }

  //TODO: 放大渐变效果?
  if (isColorBarActive) {
    return (
      <div className={colorBarContainer}>
        <div className={colorBar}>
          <div className={colorBarText}>
            <span>字体颜色</span>
          </div>
          <div className={colorBarItemContainer}>
            {fontList.map(({ type, color }, index) => (
              <ColorBarItem type={type} colorKey={color} key={index}></ColorBarItem>
            ))}
          </div>
          <div className={colorBarText}>
            <span>背景颜色</span>
          </div>
          <div className={colorBarItemContainer}>
            {backgroundList.map(({ type, color }, index) => (
              <ColorBarItem type={type} colorKey={color} key={index}></ColorBarItem>
            ))}
          </div>
          <div onMouseDown={onCleanButtonDown} className={colorBarCleanButton}>
            <span>清除</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      style={{
        opacity: "0",
        transform: "translate(-103px, 0)",
      }}
    ></div>
  )
}

export default ColorBar
