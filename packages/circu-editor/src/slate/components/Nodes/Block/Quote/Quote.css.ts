import { style } from "@vanilla-extract/css"

export const quoteContainer = style({
  margin: "8px 0",
  paddingLeft: "14px",
  position: "relative",
  color: "#ebebeb",
})

export const quoteYLine = style({
  height: "100%",
  position: "absolute",
  borderLeft: "2px solid #5f5f5f",
  borderRadius: "1px",
  left: "0px",
})
