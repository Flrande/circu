import { useAtomValue } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import type { KeysUnion } from "../../../../types/utils"
import type { IBackgroundColorMap, IFontColorMap } from "../../../Nodes/Text/Color"
import { cleanColorMark } from "../../../Nodes/Text/colorHelper"
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
  const editor = useSlateStatic()
  const isColorBarActive = useAtomValue(isColorBarActiveAtom)

  const onCleanButtonClick: React.MouseEventHandler<HTMLDivElement> = () => {
    cleanColorMark(editor)
    ReactEditor.focus(editor)
  }

  if (isColorBarActive) {
    return (
      <div className={"absolute py-3 opacity-100 translate-x-[-103px] transition"}>
        <div className={"bg-neutral-800 border border-solid border-gray-900 rounded-md p-3 w-[236px] shadow-lg"}>
          <div className={"text-sm mt-[6px] mb-1"}>
            <span>字体颜色</span>
          </div>
          <div className={"flex flex-wrap"}>
            {fontList.map(({ type, color }, index) => (
              <ColorBarItem type={type} colorKey={color} key={index}></ColorBarItem>
            ))}
          </div>
          <div className={"text-sm mt-[6px] mb-1"}>
            <span>背景颜色</span>
          </div>
          <div className={"flex flex-wrap"}>
            {backgroundList.map(({ type, color }, index) => (
              <ColorBarItem type={type} colorKey={color} key={index}></ColorBarItem>
            ))}
          </div>
          <div
            onClick={onCleanButtonClick}
            className={
              "flex items-center justify-center mt-[6px] mb-1 py-1 text-sm border border-solid border-neutral-600 rounded-md hover:bg-zinc-900 active:bg-zinc-800"
            }
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
