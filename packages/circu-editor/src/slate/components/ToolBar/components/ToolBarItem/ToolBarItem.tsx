import React, { useEffect, useRef, useState } from "react"
import { useIconColor } from "./useIconColor"

const ToolBarItem: React.FC<
  React.PropsWithChildren<{
    isStyleActive: boolean
    styleMessage?: string
    shortcutMessage?: string
    onClick?: React.MouseEventHandler<HTMLDivElement>
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  }>
> = ({ isStyleActive, styleMessage, shortcutMessage, onClick, onMouseEnter, onMouseLeave, children }) => {
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  const [hoverBarPosition, setHoverBarPosition] = useState<{
    left: string
    bottom: string
  } | null>(null)

  const toolBarItemDom = useRef<HTMLDivElement | null>(null)
  const hoverBarDom = useRef<HTMLDivElement | null>(null)

  const { fillColor, backgroundColor } = useIconColor(isStyleActive, isMouseEnter)

  useEffect(() => {
    if (hoverBarDom.current && toolBarItemDom.current) {
      setHoverBarPosition({
        left: `${-0.5 * hoverBarDom.current.clientWidth + 0.5 * toolBarItemDom.current.clientWidth}px`,
        bottom: `${toolBarItemDom.current.clientHeight + 12}px`,
      })
    }
  }, [isMouseEnter])

  return (
    <div ref={toolBarItemDom} className={"py-2 px-1 relative"}>
      <div
        onClick={onClick}
        onMouseEnter={(event) => {
          setIsMouseEnter(true)
          if (onMouseEnter) {
            onMouseEnter(event)
          }
        }}
        onMouseLeave={(event) => {
          setIsMouseEnter(false)
          if (onMouseLeave) {
            onMouseLeave(event)
          }
        }}
        className={"flex items-center justify-center h-[30px] w-[30px] rounded-md cursor-pointer"}
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <div
          className={"h-6 w-6"}
          style={{
            // 设计上这应该是离 icon svg 最近的一个 color,
            // 否则 svg 中的 currentColor 会导致颜色与预期不符
            color: fillColor,
          }}
        >
          {children}
        </div>
      </div>
      {(styleMessage || shortcutMessage) && (
        <div
          ref={hoverBarDom}
          className={"absolute bg-neutral-700 rounded-md text-center text-sm p-3 whitespace-nowrap"}
          style={{
            display: isMouseEnter ? undefined : "none",
            left: hoverBarPosition ? hoverBarPosition.left : undefined,
            bottom: hoverBarPosition ? hoverBarPosition.bottom : undefined,
          }}
        >
          {styleMessage && <div>{styleMessage}</div>}
          {shortcutMessage && <div>{shortcutMessage}</div>}
          <div className={"relative"}>
            <div className={"text-neutral-700 absolute left-2/4 -bottom-6 -translate-x-1/2"}>
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36 19L24 31L12 19H36Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinejoin="bevel"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToolBarItem
