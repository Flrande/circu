import { useEffect, useState } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IBlockCode_CodeArea } from "./types"

const BlockCode_CodeArea: React.FC<CustomRenderElementProps<IBlockCode_CodeArea>> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlateStatic()
  const [containerDom, setContainerDom] = useState<HTMLElement>()
  const [ifEditable, setIfEditable] = useState<false | undefined>(false)

  // 用于将用户选区限制在代码块内
  useEffect(() => {
    if (containerDom) {
      const controller_1 = new AbortController()

      containerDom.addEventListener(
        "mousedown",
        () => {
          const controller_2 = new AbortController()
          setIfEditable(undefined)

          containerDom.addEventListener(
            "mouseleave",
            () => {
              setIfEditable(false)
            },
            {
              signal: controller_2.signal,
            }
          )

          document.addEventListener(
            "mouseup",
            () => {
              // 用于修复一个边界情况:
              // 当鼠标移进移出代码块时, 浏览器选区有可能会与编辑器选区发生不一致
              const sel = window.getSelection()
              if (sel) {
                const newRange = ReactEditor.toSlateRange(editor, sel, {
                  exactMatch: true,
                  suppressThrow: true,
                })
                if (newRange) {
                  Transforms.select(editor, newRange)
                }
              }

              setIfEditable(undefined)
              controller_2.abort()
            },
            {
              signal: controller_2.signal,
            }
          )
        },
        {
          signal: controller_1.signal,
        }
      )

      return () => {
        controller_1.abort()
      }
    }
  }, [containerDom])

  useEffect(() => {
    setContainerDom(ReactEditor.toDOMNode(editor, element))
  }, [editor, element])

  return (
    <div
      {...attributes}
      style={{
        width: "100%",
      }}
      contentEditable={ifEditable}
    >
      {children}
    </div>
  )
}

export default BlockCode_CodeArea
