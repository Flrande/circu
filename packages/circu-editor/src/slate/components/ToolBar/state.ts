import { atom, useSetAtom } from "jotai"
import { atomWithProxy } from "jotai/valtio"
import { useEffect } from "react"
import { Editor } from "slate"
import { useSlateStatic } from "slate-react"
import { proxy } from "valtio"
import { DOC_WIDTH, EDITOR_ROOT_DOM_ID } from "../../types/constant"
import { SlateRange } from "../../types/slate"

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
  const editor = useSlateStatic()

  const setToolBarState = useSetAtom(toolBarStateAtom)
  const setActiveButton = useSetAtom(activeButtonAtom)

  useEffect(() => {
    const mouseDownController = new AbortController()

    document.getElementById(EDITOR_ROOT_DOM_ID)!.addEventListener(
      "mousedown",
      () => {
        setToolBarState({
          isActive: false,
          position: null,
        })

        document.getElementById(EDITOR_ROOT_DOM_ID)!.addEventListener(
          "mouseup",
          (event) => {
            // 若不放在宏任务中, 点击蓝区, 执行 mouseup 事件回调时 domSelection 仍未更新 (仍是折叠状态),
            // 这会导致 ToolBar 无法正常消失 (鼠标按钮放开后再次出现)
            setTimeout(() => {
              // 若选中标题, 不显示
              const titleRange = Editor.range(editor, [0])
              if (editor.selection && SlateRange.intersection(titleRange, editor.selection)) {
                return
              }

              const domSelection = window.getSelection()
              if (domSelection && !domSelection.isCollapsed) {
                // 文档左右两边到视口的距离
                const docXPadding = (document.getElementById(EDITOR_ROOT_DOM_ID)!.clientWidth - DOC_WIDTH) / 2
                let x = event.clientX
                let y = event.clientY

                if (x <= docXPadding) {
                  x = 0
                } else if (x >= docXPadding + DOC_WIDTH) {
                  x = 650
                } else {
                  x -= docXPadding
                  x += 20
                  x = x >= 650 ? 650 : x
                }
                if (y < 80) {
                  y += 50 + window.scrollY
                } else {
                  y -= 80
                  y += window.scrollY
                }

                setToolBarState({
                  isActive: true,
                  position: {
                    x: x - document.getElementById(EDITOR_ROOT_DOM_ID)!.getBoundingClientRect().left,
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
  | "quote"
  | "link"
  | "ordered-list"
  | "unordered-list"
  | "inline-code"
  | "block-code"
>("no-active")
