import { useState } from "react"
import { useIconColor } from "./useIconColor"

const ToolBarItem: React.FC<{
  isStyleActive: boolean
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}> = ({ isStyleActive, onMouseDown, onMouseEnter, onMouseLeave, children }) => {
  const [isMouseenter, setIsMouseenter] = useState(false)
  const { fillColor, backgroundColor } = useIconColor(isStyleActive, isMouseenter)

  return (
    <div>
      <div
        style={{
          padding: "8px 4px",
        }}
      >
        <div
          onMouseDown={onMouseDown}
          onMouseEnter={(event) => {
            setIsMouseenter(true)
            if (onMouseEnter) {
              onMouseEnter(event)
            }
          }}
          onMouseLeave={(event) => {
            setIsMouseenter(false)
            if (onMouseLeave) {
              onMouseLeave(event)
            }
          }}
          style={{
            height: "24px",
            width: "24px",
            overflow: "hidden",
            borderRadius: "6px",
            backgroundColor: backgroundColor,
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
