import { useAtomValue } from "jotai"
import { Editor } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { mouseXBlockPathAtom } from "../../state/mouse"
import { BLOCK_ELEMENTS_WITH_CHILDREN, DOC_WIDTH } from "../../types/constant"
import type { BlockElementWithChildren } from "../../types/interface"
import { SlateElement } from "../../types/slate"
import { arrayIncludes } from "../../utils/general"
import { toggleFold, unToggleFold } from "./foldHelper"

const FoldButton: React.FC = () => {
  const editor = useSlateStatic()
  const xBlockPath = useAtomValue(mouseXBlockPathAtom)

  if (xBlockPath) {
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

            try {
              const [parentNode] = Editor.node(editor, parentBlockPath)
              if (SlateElement.isElement(parentNode) && parentNode.type === "quote") {
                quoteFlag = true
              }
            } catch (error) {}
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
          const docXPadding = (document.documentElement.clientWidth - DOC_WIDTH) / 2

          return (
            <div
              style={{
                position: "absolute",
                left: `${quoteFlag ? rect.left - docXPadding - 34 : rect.left - docXPadding - 20}px`,
                top: `${rect.top + window.scrollY + 1}px`,
              }}
            >
              <div contentEditable={false} onClick={onClick}>
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

  return <div></div>
}

export default FoldButton
