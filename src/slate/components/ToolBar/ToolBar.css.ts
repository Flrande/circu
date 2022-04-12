import { style } from "@vanilla-extract/css"

export const toolBarContainer = style({
  backgroundColor: "#292929",
  position: "absolute",
  display: "block",
  padding: "0 6px",
  border: "1px solid #3d3d3d",
  borderRadius: "6px",
  filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.28))",
})

export const toolBar = style({
  listStyle: "none",
  minWidth: "0",
  position: "relative",
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  padding: "0",
  margin: "0",
})

export const toolBarItemContainer = style({
  padding: "6px 2px",
})

export const toolBarButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "30px",
  width: "30px",
  overflow: "hidden",
  borderRadius: "6px",
})

export const toolBarButtonSvg = style({
  height: "24px",
  width: "24px",
})
