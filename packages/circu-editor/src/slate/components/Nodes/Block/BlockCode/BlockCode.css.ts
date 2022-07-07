import { style } from "@vanilla-extract/css"

export const blockCodeContainer = style({
  backgroundColor: "#292929",
  margin: "8px 0",
  fontSize: "14px",
  fontWeight: "400",
  borderRadius: "4px",
})

export const blockCodeCodeArea = style({
  display: "flex",
  minHeight: "49px",
  // 这个 22px 与行序号高度的计算相关联, 若修改需一起改动
  lineHeight: "22px",
  padding: "8px 20px 8px 20px",
})

export const blockCodeOrderWrapper = style({
  display: "flex",
  flexDirection: "column",
  position: "sticky",
  left: "0",
  userSelect: "none",
  color: "#a6a6a6",
  paddingRight: "12px",
  whiteSpace: "nowrap",
  textAlign: "right",
})
