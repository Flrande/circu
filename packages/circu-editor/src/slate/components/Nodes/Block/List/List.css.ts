import { style } from "@vanilla-extract/css"

export const orderedListSymbolContainer = style({
  userSelect: "none",
  color: "#5a87f7",
  paddingLeft: "2px",
})

export const orderedListSymbol = style({
  ":hover": {
    backgroundColor: "#22293a",
    borderRadius: "4px",
  },
  ":active": {
    backgroundColor: "#272f45",
    borderRadius: "4px",
  },
})

export const unorderedListSymbol = style({
  userSelect: "none",
  minWidth: "22px",
  height: "100%",
  color: "#5a87f7",
})

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

export const orderedListModifyBarContainer = style({
  position: "absolute",
  minWidth: "284px",
  height: "56px",
  display: "flex",
  alignItems: "center",
  padding: "12px",
  border: "1px solid rgba(235, 235, 235, 0.15)",
  boxShadow: "0 6px 24px 0 rgba(208, 208, 208, 0.1)",
  borderRadius: "6px",
  backgroundColor: "#1a1a1a",
})

export const orderedListModifyBarSpan = style({
  color: "ebebeb",
  fontSize: "14px",
  lineHeight: "22px",
})

export const orderedListModifyBarInputContainer = style({
  width: "88px",
  border: "1px solid #505050",
  borderRadius: "4px",
  position: "relative",
  margin: "0 8px",
  ":focus-within": {
    borderColor: "#4c88ff",
  },
  ":hover": {
    borderColor: "#4c88ff",
  },
})

export const orderedListModifyBarInputButtonContainer = style({
  width: "34px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "absolute",
  right: "0",
})

export const orderedListModifyBarInput = style({
  width: "100%",
  height: "30px",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#ebebeb",
  backgroundColor: "#1a1a1a",
  borderRadius: "4px",
  border: "none",
  padding: "6px 44px 6px 10px",
})

export const orderedListModifyBarInputTopButton = style({
  height: "calc(50% + 1px)",
  background: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "-1px",
  border: "none",
  borderBottom: "1px solid rgba(0, 0, 0, 0)",
  borderLeft: "1px solid rgb(80, 80, 80)",
  borderTopRightRadius: "4px",
  color: "#a6a6a6",
  cursor: "pointer",
  zIndex: "5",
  ":hover": {
    zIndex: "10",
    borderColor: "#4c88ff",
    color: "#4c88ff",
  },
})

export const orderedListModifyBarInputBottomButton = style({
  height: "calc(50% + 1px)",
  background: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  borderBottomRightRadius: "4px",
  borderTop: "1px solid rgb(80, 80, 80)",
  borderLeft: "1px solid rgb(80, 80, 80)",
  color: "#a6a6a6",
  cursor: "pointer",
  zIndex: "5",
  ":hover": {
    borderColor: "#4c88ff",
    color: "#4c88ff",
  },
})

export const orderedListModifyBarButtonContainer = style({
  display: "flex",
  justifyContent: "flex-end",
  marginLeft: "12px",
})

export const orderedListModifyBarButton = style({
  height: "32px",
  lineHeight: "22px",
  textAlign: "center",
  padding: "4px 11px",
  fontSize: "14px",
  borderRadius: "6px",
  boxSizing: "border-box",
  width: "80px",
  color: "#ffffff",
  background: "#4c88ff",
  border: "1px solid #4c88ff",
  ":hover": {
    background: "#3c64ca",
  },
  ":active": {
    background: "#7a9ff8",
  },
})
