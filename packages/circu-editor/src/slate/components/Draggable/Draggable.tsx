import { useAtomValue } from "jotai"
import { useRef } from "react"
import { Editor, Path } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { mouseXStateAtom } from "../../state/mouse"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, DOC_WIDTH, EDITOR_ROOT_DOM_ID } from "../../types/constant"
import type { BlockElementExceptTextLine } from "../../types/interface"
import { SlateElement } from "../../types/slate"
import { arrayIncludes } from "../../utils/general"
import { isFoldButtonActiveAtom } from "../FoldButton/state"
import { toolBarStateAtom } from "../ToolBar/state"
import { useDragBlock } from "./useDragBlock"

const Draggable: React.FC = () => {
  const editor = useSlateStatic()

  const mouseXState = useAtomValue(mouseXStateAtom)
  const isFoldButtonActive = useAtomValue(isFoldButtonActiveAtom)
  const toolBarState = useAtomValue(toolBarStateAtom)

  const xDomRef = useRef<HTMLElement | null>(null)
  const tmpXPath = useRef<Path | null>(null)
  if (
    tmpXPath.current &&
    mouseXState.xBlockPath &&
    !Path.equals(tmpXPath.current, mouseXState.xBlockPath) &&
    xDomRef.current
  ) {
    xDomRef.current.style.removeProperty("background-color")
    xDomRef.current.style.removeProperty("border-radius")
  }
  tmpXPath.current = mouseXState.xBlockPath

  const { dragRef, onDragStart } = useDragBlock()

  if (mouseXState.xBlockPath && (!toolBarState || !toolBarState.isActive)) {
    try {
      const xBlockPath = mouseXState.xBlockPath
      const [node] = Editor.node(editor, xBlockPath)

      if (SlateElement.isElement(node) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, node.type)) {
        const element = node as BlockElementExceptTextLine
        xDomRef.current = ReactEditor.toDOMNode(editor, element)

        // 判断父块级节点是不是引用, 若是, 要调整按钮的位置
        let quoteFlag = false
        if (xBlockPath.length >= 3) {
          const parentBlockPath = xBlockPath.slice(0, -2)

          const [parentNode] = Editor.node(editor, parentBlockPath)
          if (SlateElement.isElement(parentNode) && parentNode.type === "quote") {
            quoteFlag = true
          }
        }

        // 计算位置
        const rect = xDomRef.current.getBoundingClientRect()
        // 文档左右两边到视口的距离
        const docXPadding = (document.getElementById(EDITOR_ROOT_DOM_ID)!.clientWidth - DOC_WIDTH) / 2

        let left =
          rect.left - docXPadding - 22 - document.getElementById(EDITOR_ROOT_DOM_ID)!.getBoundingClientRect().left
        if (isFoldButtonActive) {
          left -= 18
        }
        if (quoteFlag) {
          left -= 14
        }

        return (
          <div
            ref={dragRef}
            onDragStart={onDragStart}
            onMouseEnter={() => {
              if (xDomRef.current) {
                xDomRef.current.style.backgroundColor = "#192a4c"
                xDomRef.current.style.borderRadius = "4px"
              }
            }}
            onMouseLeave={() => {
              if (xDomRef.current) {
                xDomRef.current.style.removeProperty("background-color")
                xDomRef.current.style.removeProperty("border-radius")
              }
            }}
            className={
              "absolute bg-neutral-800/50 hover:bg-neutral-800 hover:border border-solid border-zinc-700 rounded w-[18px] h-6 flex items-center justify-center text-gray-400/50 hover:text-gray-400 select-none"
            }
            style={{
              left: `${left}px`,
              top: `${
                rect.top + window.scrollY + 1 - document.getElementById(EDITOR_ROOT_DOM_ID)!.getBoundingClientRect().top
              }px`,
            }}
            contentEditable={false}
          >
            <svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 10C19 12.2091 17.2091 14 15 14C12.7909 14 11 12.2091 11 10C11 7.79086 12.7909 6 15 6C17.2091 6 19 7.79086 19 10ZM15 28C17.2091 28 19 26.2091 19 24C19 21.7909 17.2091 20 15 20C12.7909 20 11 21.7909 11 24C11 26.2091 12.7909 28 15 28ZM15 42C17.2091 42 19 40.2091 19 38C19 35.7909 17.2091 34 15 34C12.7909 34 11 35.7909 11 38C11 40.2091 12.7909 42 15 42Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M37 10C37 12.2091 35.2091 14 33 14C30.7909 14 29 12.2091 29 10C29 7.79086 30.7909 6 33 6C35.2091 6 37 7.79086 37 10ZM33 28C35.2091 28 37 26.2091 37 24C37 21.7909 35.2091 20 33 20C30.7909 20 29 21.7909 29 24C29 26.2091 30.7909 28 33 28ZM33 42C35.2091 42 37 40.2091 37 38C37 35.7909 35.2091 34 33 34C30.7909 34 29 35.7909 29 38C29 40.2091 30.7909 42 33 42Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )
      }
    } catch (error) {}
  }

  return <div></div>
}

export default Draggable
