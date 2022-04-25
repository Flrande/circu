import { atom, useAtom } from "jotai"
import { useEffect } from "react"

export const toolBarStateAtom = atom<{
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

export const useToolBar = () => {
  const [, setToolBarState] = useAtom(toolBarStateAtom)

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
                y += 30
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
            }
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
