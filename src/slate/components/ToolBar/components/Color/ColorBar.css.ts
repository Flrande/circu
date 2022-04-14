import { style } from "@vanilla-extract/css"

export const ColorBarContainer = style({
  position: "absolute",
  padding: "12px 0",
  opacity: "1",
  transitionProperty: "opacity, transform",
  transitionDuration: "0.3s, 0.3s",
  transitionDelay: "0.017s, 0.017s",
  transform: "translate(-103px, 0)", // 水平偏移距离: ColorBarWidth / 2 - ColorButtonWidth / 2
})

export const ColorBarBody = style({
  backgroundColor: "#292929",
  border: "1px solid #3c3c3c",
  borderRadius: "6px",
  padding: "12px",
  width: "236px",
  filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.28))",
})

export const ColorBarText = style({
  fontSize: "13px",
  margin: "6px 0 4px 0",
})

export const ColorBarItemContainer = style({
  display: "flex",
  flexWrap: "wrap",
})

export const ColorBarCleanButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "6px 0 4px 0",
  padding: "4px 0",
  fontSize: "13px",
  border: "1px solid #3b3b3b",
  borderRadius: "4px",
})
