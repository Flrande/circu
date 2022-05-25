import { atom, useSetAtom } from "jotai"
import { atomWithProxy } from "jotai/valtio"
import { useEffect } from "react"
import { proxy } from "valtio"

export const toolBarStateStore = proxy<{
  isActive: boolean
  position: {
    x: number
    y: number
    translateY: number
  } | null
}>({
  isActive: false,
  position: null,
})
export const unActiveToolBar = () => {
  toolBarStateStore.isActive = false
  toolBarStateStore.position = null
}

export const toolBarStateAtom = atomWithProxy(toolBarStateStore)

export const useToolBar = () => {
  const setToolBarState = useSetAtom(toolBarStateAtom)
  const setActiveButton = useSetAtom(activeButtonAtom)

  useEffect(() => {
    const mouseDownController = new AbortController()

    document.addEventListener(
      "mousedown",
      () => {
        setToolBarState({
          isActive: false,
          position: null,
        })

        document.addEventListener(
          "mouseup",
          (event) => {
            // 若不放在宏任务中, 点击蓝区, 执行 mouseup 事件回调时 domSelection 仍未更新 (仍是折叠状态),
            // 这会导致 ToolBar 无法正常消失 (鼠标按钮放开后再次出现)
            setTimeout(() => {
              const domSelection = window.getSelection()
              if (domSelection && !domSelection.isCollapsed) {
                // 文档左右两边到视口的距离, 790 为文档宽度
                const docXPadding = (document.documentElement.clientWidth - 790) / 2
                let x = event.pageX
                let y = event.pageY

                if (x <= docXPadding) {
                  x = 0
                } else if (x >= docXPadding + 790) {
                  x = 790
                } else {
                  x -= docXPadding
                  x += 20
                }
                if (event.clientY < 80) {
                  y += 50
                } else {
                  y -= 80
                }

                setToolBarState({
                  isActive: true,
                  position: {
                    x,
                    y,
                    translateY: event.clientY < 80 ? -10 : 10,
                  },
                })
                // 重置 activeButtonAtom 状态
                setActiveButton("no-active")
              }
            })
          },
          {
            // 自销毁
            once: true,
          }
        )
      },
      {
        signal: mouseDownController.signal,
      }
    )

    return () => {
      mouseDownController.abort()
    }
  }, [setToolBarState])
}

// 记录当前主工具栏中"活跃"的按钮, 即用户最近移入的按钮
// 此 atom 用于控制部分子工具栏的显示, 新的按钮类型需手动添加
export const activeButtonAtom = atom<
  | "no-active"
  | "head-1"
  | "head-2"
  | "head-3"
  | "head-bar"
  | "bold"
  | "strike"
  | "underline"
  | "italic"
  | "color"
  | "link"
  | "ordered-list"
  | "unordered-list"
  | "inline-code"
  | "block-code"
>("no-active")
