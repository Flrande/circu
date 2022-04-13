import { useAtomValue } from "jotai"
import { useState } from "react"
import { useSlate } from "slate-react"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"
import { cleanColorMark } from "../../../Nodes/Text/colorHelper"
import ColorBarItem from "./ColorBarItem"
import { isColorBarActiveAtom, selectedColorAtom } from "./state"

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
  const [isMouseEnterCleanButton, setIsMouseEnterCleanButton] = useState(false)

  const onCleanButtonDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    cleanColorMark(editor)
  }

  //TODO: 抽离 css
  //TODO: 放大渐变效果?
  if (isColorBarActive) {
    return (
      <div
        style={{
          position: "absolute",
          padding: "12px 0",
          opacity: "1",
          transitionProperty: "opacity, transform",
          transitionDuration: "0.3s, 0.3s",
          transitionDelay: "0.017s, 0.017s",
          transform: "translate(-103px, 0)", // 水平偏移距离: ColorBarWidth / 2 - ColorButtonWidth / 2
        }}
      >
        <div
          style={{
            backgroundColor: "#292929",
            border: "1px solid #3c3c3c",
            borderRadius: "6px",
            padding: "12px",
            width: "236px",
            filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.28))",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              margin: "6px 0 4px 0",
            }}
          >
            <span>字体颜色</span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {fontList.map(({ type, color }, index) => (
              <ColorBarItem type={type} colorKey={color} key={index}></ColorBarItem>
            ))}
          </div>
          <div
            style={{
              fontSize: "13px",
              margin: "6px 0 4px 0",
            }}
          >
            <span>背景颜色</span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {backgroundList.map(({ type, color }, index) => (
              <ColorBarItem type={type} colorKey={color} key={index}></ColorBarItem>
            ))}
          </div>
          <div
            onMouseDown={onCleanButtonDown}
            onMouseEnter={() => {
              setIsMouseEnterCleanButton(true)
            }}
            onMouseLeave={() => {
              setIsMouseEnterCleanButton(false)
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "6px 0 4px 0",
              padding: "4px 0",
              fontSize: "13px",
              border: "1px solid #3b3b3b",
              borderRadius: "4px",
              backgroundColor: isMouseEnterCleanButton ? "#373737" : undefined,
            }}
          >
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
