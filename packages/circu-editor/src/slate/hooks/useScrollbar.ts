import { useEffect } from "react"

/**
 * 用于设置自定义滚动条 contentEditable 属性的钩子
 *
 * 对于在富文本编辑区域内且用到自定义滚动条的组件, 需要添加该钩子
 *
 */
export const useScrollbar = () => {
  useEffect(() => {
    const doms = document.querySelectorAll(".scrollbar-track")

    for (const dom of Array.from(doms)) {
      if (dom instanceof HTMLElement) {
        ;(dom as HTMLElement).contentEditable = "false"
      }
    }
  })
}
