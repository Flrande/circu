import type { KeysUnion } from "../../../types/utils"

// 参考色板 -> https://arco.design/react/docs/palette
export type IFontColorMap = {
  red: "#F76965"
  orange: "#FF9626"
  yellow: "#FBE94B"
  lime: "#B8E24B"
  blue: "#5AAAFB"
  pinkPurple: "#E13DDB"
  gray: "#929293"
}

export type IBackgroundColorMap = {
  red_1: "#770611"
  red_2: "#CB2E34"
  orange_1: "#4D1B00"
  orange_2: "#A64B0A"
  yellow_1: "#4D3800"
  yellow_2: "#785E07"
  lime_1: "#2A4D00"
  lime_2: "#447006"
  blue_1: "#001A4D"
  blue_2: "#2971CF"
  pinkPurple_1: "#650370"
  pinkPurple_2: "#B01BB6"
  gray_1: "#2E2E30"
  gray_2: "#5F5F60"
}

export const fontColorMap: IFontColorMap = {
  red: "#F76965",
  orange: "#FF9626",
  yellow: "#FBE94B",
  lime: "#B8E24B",
  blue: "#5AAAFB",
  pinkPurple: "#E13DDB",
  gray: "#929293",
}

export const backgroundColorMap: IBackgroundColorMap = {
  red_1: "#770611",
  red_2: "#CB2E34",
  orange_1: "#4D1B00",
  orange_2: "#A64B0A",
  yellow_1: "#4D3800",
  yellow_2: "#785E07",
  lime_1: "#2A4D00",
  lime_2: "#447006",
  blue_1: "#001A4D",
  blue_2: "#2971CF",
  pinkPurple_1: "#650370",
  pinkPurple_2: "#B01BB6",
  gray_1: "#2E2E30",
  gray_2: "#5F5F60",
}

const Color: React.FC<{
  fontColorKey?: KeysUnion<IFontColorMap>
  backgroundColorKey?: KeysUnion<IBackgroundColorMap>
}> = ({ fontColorKey, backgroundColorKey, children }) => {
  return (
    <span
      style={{
        backgroundColor: backgroundColorKey ? backgroundColorMap[backgroundColorKey] : undefined,
        color: fontColorKey ? fontColorMap[fontColorKey] : undefined,
      }}
    >
      {children}
    </span>
  )
}

export default Color
