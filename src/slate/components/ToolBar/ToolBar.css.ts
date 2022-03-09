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
