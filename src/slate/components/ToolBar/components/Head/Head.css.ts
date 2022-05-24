import { style } from "@vanilla-extract/css"

export const headButtonArrow = style({
  position: "absolute",
  left: "20px",
  top: "10px",
  width: "12px",
  height: "12px",
  transition: "transform 0.2s",
})

export const headButtonBarContainer = style({
  position: "absolute",
  transform: "translate(-46px, -60px)",
  opacity: "1",
  transitionProperty: "opacity, transform",
  transitionDuration: "0.3s, 0.3s",
  transitionDelay: "0.017s, 0.017s",
  zIndex: "50",
  userSelect: "none",
})

export const headButtonBarList = style({
  padding: "0 6px",
  display: "flex",
  borderRadius: "6px",
  border: "1px solid rgba(235, 235, 235, 0.15)",
  boxShadow: "0 6px 24px 0 rgba(0, 0, 0, 0.28)",
  backgroundColor: "#292929",
})
