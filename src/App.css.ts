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
  fontFamily:
    "LarkHackSafariFont,LarkEmojiFont,LarkChineseQuote,-apple-system,BlinkMacSystemFont,Helvetica Neue,Arial,Segoe UI,PingFang SC,Microsoft Yahei,Hiragino Sans GB,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji!important",
  color: "#ebebeb",
  padding: "16px",
})
