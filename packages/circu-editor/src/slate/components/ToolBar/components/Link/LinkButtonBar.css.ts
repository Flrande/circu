import { style } from "@vanilla-extract/css"

export const linkButtonBarContainer = style({
  position: "absolute",
  zIndex: "5",
  backgroundColor: "#292929",
  border: "1px solid #3c3c3c",
  borderRadius: "6px",
  padding: "8px 16px",
  boxShadow: "0 3px 12px 0 rgba(0, 0, 0, 0.28)",
})

export const linkButtonBarSpan = style({
  textAlign: "right",
  marginRight: "12px",
})

export const linkButtonBarInput = style({
  height: "32px",
  width: "250px",
  lineHeight: "32px",
  paddingLeft: "12px",
  borderRadius: "6px",
  border: "1px solid #464646",
  backgroundColor: "#292929",
  color: "#ebebeb",
  fontSize: "14px",
  marginRight: "12px",
  "::placeholder": {
    color: "#757575",
  },
})

export const linkButtonBarButton = style({
  width: "68px",
  height: "32px",
  color: "#ebebeb",
  border: "none",
  backgroundColor: "#5a87f7",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
})
