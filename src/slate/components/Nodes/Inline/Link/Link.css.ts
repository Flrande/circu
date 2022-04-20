import { style } from "@vanilla-extract/css"

export const linkContainer = style({
  cursor: "pointer",
  color: "#5a87d3",
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
})

export const linkBarContainer = style({
  position: "absolute",
  zIndex: "5",
  display: "flex",
  backgroundColor: "#292929",
  border: "1px solid #3c3c3c",
  borderRadius: "6px",
  padding: "8px 16px",
  boxShadow: "0 3px 12px 0 rgba(0, 0, 0, 0.28)",
})

export const linkBarUrlContainer = style({
  height: "32px",
  width: "250px",
  lineHeight: "32px",
  fontSize: "14px",
  color: "#ebebeb",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

export const linkBarEditIconContainer = style({
  width: "32px",
  height: "32px",
  padding: "4px",
  marginLeft: "15px",
  borderRadius: "6px",
  ":hover": {
    backgroundColor: "#3d3d3d",
  },
})

export const linkBarBreakIconContainer = style({
  width: "32px",
  height: "32px",
  padding: "4px",
  marginLeft: "12px",
  borderRadius: "6px",
  ":hover": {
    backgroundColor: "#3d3d3d",
  },
})

export const linkEditBarContainer = style({
  position: "absolute",
  zIndex: "5",
  backgroundColor: "#292929",
  border: "1px solid #3c3c3c",
  borderRadius: "6px",
  padding: "8px 16px",
  boxShadow: "0 3px 12px 0 rgba(0, 0, 0, 0.28)",
})

export const linkEditBarRow = style({
  color: "#ebebeb",
  fontSize: "14px",
  lineHeight: "1.5",
})

export const linkEditBarSpan = style({
  textAlign: "right",
  marginRight: "12px",
})

export const linkEditBarRowInput = style({
  height: "32px",
  width: "250px",
  lineHeight: "32px",
  paddingLeft: "12px",
  borderRadius: "6px",
  border: "1px solid #464646",
  backgroundColor: "#292929",
  color: "#ebebeb",
  fontSize: "14px",
})

export const linkEditBarButton = style({
  width: "68px",
  height: "32px",
  color: "#ebebeb",
  border: "none",
  backgroundColor: "#5a87f7",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
})
