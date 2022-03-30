import React, { useEffect, useRef } from "react"
import { useSelected, useSlate } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { BlockCodeContainer } from "./BlockCode.css"
import type { BlockCodeType } from "./types"

//TODO: 高亮语言选择
const BlockCode: React.FC<CustomRenderElementProps<BlockCodeType>> = ({ attributes, children }) => {
  const isSelected = useSelected()
  const containerDom = useRef<HTMLDivElement | null>(null)
  const editor = useSlate()

  // 用于限制用户的选区
  // 选择起始点在代码块内时无法选择代码块外的内容
  useEffect(() => {
    const sel = window.getSelection()
    if (containerDom.current) {
      const dom = containerDom.current // 制造一个闭包
      if (sel && dom.contains(sel.anchorNode)) {
        const onDocumentMouseMove = (event: MouseEvent) => {
          event.preventDefault()
        }
        const onDocumentMouseUp = () => {
          document.removeEventListener("mousemove", onDocumentMouseMove)
          document.removeEventListener("mouseup", onDocumentMouseUp)
        }
        const onDomMouseEnter = () => {
          document.removeEventListener("mousemove", onDocumentMouseMove)
        }
        const onDomMouseLeave = () => {
          document.addEventListener("mousemove", onDocumentMouseMove)
          dom.addEventListener("mouseenter", onDomMouseEnter)
        }

        dom.addEventListener("mouseleave", onDomMouseLeave)

        document.addEventListener("mouseup", onDocumentMouseUp)

        return () => {
          dom.removeEventListener("mouseleave", onDomMouseLeave)
        }
      }
    }
  }, [containerDom.current, editor.selection])

  return (
    <div
      {...attributes}
      style={{
        border: isSelected ? "1px solid #5a87f7" : undefined,
      }}
      className={BlockCodeContainer}
      ref={containerDom}
    >
      {children}
    </div>
  )
}

export default BlockCode
