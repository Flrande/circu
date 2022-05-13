import { style } from "@vanilla-extract/css"

export const orderedListBarContainer = style({
  position: "absolute",
  backgroundColor: "#292929",
  border: "1px solid rgba(235, 235, 235, 0.15)",
  boxShadow: "0 6px 24px 0 rgba(208, 208, 208, 0.1)",
  padding: "12px 0",
  borderRadius: "6px",
})

export const orderedListBarItemContainer = style({
  display: "flex",
  alignItems: "center",
  height: "20px",
  padding: "6px 16px",
  margin: "4px 8px",
  boxSizing: "content-box",
  ":hover": {
    backgroundColor: "rgba(235, 235, 235, 0.08)",
    borderRadius: "6px",
  },
})
