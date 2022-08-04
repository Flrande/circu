import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { Editor } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { mouseXStateAtom } from "../../state/mouse"
import { BLOCK_ELEMENTS_WITH_CHILDREN, DOC_WIDTH, EDITOR_ROOT_DOM_ID } from "../../types/constant"
import type { BlockElementWithChildren } from "../../types/interface"
import { SlateElement } from "../../types/slate"
import { arrayIncludes } from "../../utils/general"
import { isDraggingAtom } from "../Draggable/state"
import { toggleFold, unToggleFold } from "./foldHelper"
import { isFoldButtonActiveAtom } from "./state"

const FoldButton: React.FC = () => {
  const editor = useSlateStatic()

  const mouseXState = useAtomValue(mouseXStateAtom)
  const setIsFoldButtonActive = useSetAtom(isFoldButtonActiveAtom)
  const isDragging = useAtomValue(isDraggingAtom)

  // 标记折叠按钮是否显示
  const setActiveFlag = useRef(false)

  useEffect(() => {
    setIsFoldButtonActive(setActiveFlag.current)
  })

  if (mouseXState.xBlockPath && !isDragging) {
    const xBlockPath = mouseXState.xBlockPath
    try {
      const [node] = Editor.node(editor, xBlockPath)

      if (SlateElement.isElement(node) && arrayIncludes(BLOCK_ELEMENTS_WITH_CHILDREN, node.type)) {
        const element = node as BlockElementWithChildren
        const dom = ReactEditor.toDOMNode(editor, element)

        if (element.type === "head" || (element.children.length > 1 && dom)) {
          // 判断父块级节点是不是引用, 若是, 要调整按钮的位置
          let quoteFlag = false
          if (xBlockPath.length >= 3) {
            const parentBlockPath = xBlockPath.slice(0, -2)

            const [parentNode] = Editor.node(editor, parentBlockPath)
            if (SlateElement.isElement(parentNode) && parentNode.type === "quote") {
              quoteFlag = true
            }
          }

          const onClick: React.MouseEventHandler = () => {
            if (element.isFolded) {
              unToggleFold(editor, xBlockPath)
            } else {
              toggleFold(editor, xBlockPath)
            }
          }

          // 计算位置
          const rect = dom.getBoundingClientRect()
          // 文档左右两边到视口的距离
          const docXPadding = (document.getElementById(EDITOR_ROOT_DOM_ID)!.clientWidth - DOC_WIDTH) / 2

          setActiveFlag.current = true

          return (
            <div
              style={{
                position: "absolute",
                left: `${
                  quoteFlag
                    ? rect.left -
                      docXPadding -
                      34 -
                      document.getElementById(EDITOR_ROOT_DOM_ID)!.getBoundingClientRect().left
                    : rect.left -
                      docXPadding -
                      20 -
                      document.getElementById(EDITOR_ROOT_DOM_ID)!.getBoundingClientRect().left
                }px`,
                top: `${rect.top + window.scrollY + 1}px`,
                userSelect: "none",
              }}
              contentEditable={false}
            >
              <div onClick={onClick}>
                <svg
                  style={{
                    transform: element.isFolded ? "rotate(-0.25turn)" : undefined,
                  }}
                  className={"text-white hover:text-blue-500"}
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
          )
        }
      }
    } catch (error) {}
  }

  setActiveFlag.current = false

  return <div></div>
}

export default FoldButton
