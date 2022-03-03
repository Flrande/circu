import { style } from "@vanilla-extract/css"

export const docContainer = style({
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#1a1a1a",
})

export const doc = style({
  width: "790px",
  fontFamily: "Source Code Pro,Menlo,Monaco,Consolas,Liberation Mono,Courier New,Microsoft Yahei;",
  color: "#ebebeb",
  fontSize: "16px",
  fontWeight: "400",
  padding: "16px",
  letterSpacing: ".02em",
  lineHeight: "1.6",
})
