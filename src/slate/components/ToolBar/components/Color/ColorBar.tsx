import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"
import { backgroundColorMap } from "../../../Nodes/Text/Color"
import ColorBarIcon from "./ColorBarIcon"

const ColorBarItem = <T extends "font" | "background">({
  type,
  colorKey,
}: {
  type: T
  colorKey: T extends "font" ? KeysUnion<IFontColorMap> : KeysUnion<IBackgroundColorMap>
}) => {
  if (type === "font") {
    return (
      <div>
        <div
          style={{
            height: "24px",
            width: "24px",
          }}
        >
          <ColorBarIcon fontColorKey={colorKey as KeysUnion<IFontColorMap>}></ColorBarIcon>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div
          style={{
            height: "24px",
            width: "24px",
            backgroundColor: backgroundColorMap[colorKey as KeysUnion<IBackgroundColorMap>],
          }}
        >
          <ColorBarIcon></ColorBarIcon>
        </div>
      </div>
    )
  }
}
const ColorBar: React.FC = () => {
  const fontList: Array<{
    type: "font"
    color: KeysUnion<IFontColorMap>
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
  const ifColorBarActive = false

  if (ifColorBarActive) {
    return (
      <div>
        <div>
          <span>字体颜色</span>
        </div>
        <div>
          {fontList.map(({ type, color }) => (
            <ColorBarItem type={type} colorKey={color}></ColorBarItem>
          ))}
        </div>
        <div>
          <span>背景颜色</span>
        </div>
        <div>
          {backgroundList.map(({ type, color }) => (
            <ColorBarItem type={type} colorKey={color}></ColorBarItem>
          ))}
        </div>
      </div>
    )
  }
  return <div style={{ opacity: "0" }}></div>
}

export default ColorBar
