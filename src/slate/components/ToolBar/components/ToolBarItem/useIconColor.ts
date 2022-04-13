// 一般而言, 图标背景颜色有四种情况 (由鼠标位置和样式是否被激活决定)
// 1. mouse not active + style not active -> 不需要设置背景颜色
// 2. mouse active + style not active -> #383838
// 3. mouse not active + style active -> #333c52
// 4. mouse active + style active -> #3d4b6c
export const toolBarIconBackgroundColor = {
  focusStatic: "#383838",
  nofocusActive: "#333c52",
  focusActive: "#3d4b6c",
}

// 样式激活前后 svg 的 fill color
export const toolBarIconStaticFillColor = "#ffffff"
export const toolBarIconActiveFillColor = "#5985f5"

// 接受鼠标状态和样式状态, 返回 backgroundColor 和 fillColor
export const useIconColor = (isStyleActive: boolean, isMouseenter: boolean) => {
  let result: {
    fillColor: string
    backgroundColor: string | undefined
  } = {
    fillColor: toolBarIconStaticFillColor,
    backgroundColor: undefined,
  }

  if (!isStyleActive && isMouseenter) {
    result.backgroundColor = toolBarIconBackgroundColor.focusStatic
  } else if (isStyleActive && isMouseenter) {
    result.backgroundColor = toolBarIconBackgroundColor.focusActive
    result.fillColor = toolBarIconActiveFillColor
  } else if (isStyleActive && !isMouseenter) {
    result.backgroundColor = toolBarIconBackgroundColor.nofocusActive
    result.fillColor = toolBarIconActiveFillColor
  }

  return result
}
