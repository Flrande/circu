import React, { useState } from "react"
import { useIconColor } from "./useIconColor"

const ToolBarItem: React.FC<
  React.PropsWithChildren<{
    isStyleActive: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  }>
> = ({ isStyleActive, onClick, onMouseEnter, onMouseLeave, children }) => {
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  const { fillColor, backgroundColor } = useIconColor(isStyleActive, isMouseEnter)

  return (
    <div className={"py-2 px-1"}>
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
    </div>
  )
}

export default ToolBarItem
