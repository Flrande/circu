import { useAtomValue } from "jotai"
import { Editor } from "slate"
import { useSlateStatic } from "slate-react"
import { BLOCK_ELEMENTS_WITH_CHILDREN } from "../../types/constant"
import type { BlockElementWithChildren } from "../../types/interface"
import { SlateElement } from "../../types/slate"
import { arrayIncludes } from "../../utils/general"
import { toggleFold, unToggleFold } from "./foldHelper"
import { foldStateAtom } from "./state"

const FoldButton: React.FC = () => {
  const editor = useSlateStatic()
  const foldState = useAtomValue(foldStateAtom)

  if (foldState) {
    try {
      const path = foldState.path
      const [node] = Editor.node(editor, path)

      if (SlateElement.isElement(node) && arrayIncludes(BLOCK_ELEMENTS_WITH_CHILDREN, node.type)) {
        const element = node as BlockElementWithChildren

        if (element.type === "head" || element.children.length > 1) {
          // 判断父块级节点是不是引用, 若是, 要调整按钮的位置
          let quoteFlag = false
          if (path.length >= 3) {
            const parentBlockPath = path.slice(0, -2)

            try {
              const [parentNode] = Editor.node(editor, parentBlockPath)
              if (SlateElement.isElement(parentNode) && parentNode.type === "quote") {
                quoteFlag = true
              }
            } catch (error) {}
          }

          const onClick: React.MouseEventHandler = () => {
            if (element.isFolded) {
              unToggleFold(editor, path)
            } else {
              toggleFold(editor, path)
            }
          }

          return (
            <div
              style={{
                position: "absolute",
                left: `${quoteFlag ? foldState.left - 14 : foldState.left}px`,
                top: `${foldState.top}px`,
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
