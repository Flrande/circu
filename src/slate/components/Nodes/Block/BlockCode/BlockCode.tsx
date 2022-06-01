import { ReactEditor, useSelected, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps, KeysUnion } from "../../../../types/utils"
import { blockCodeContainer } from "./BlockCode.css"
import type { IBlockCode, IBlockCode_CodeArea, ICodeAreaLangMap } from "./types"
import { Select } from "@arco-design/web-react"
import { SlateNode } from "../../../../types/slate"
import { Transforms } from "slate"
import { codeAreaLangMap } from "./constant"
import { useEffect, useState } from "react"

//TODO: 代码较长时出现横向滚动条
const BlockCode: React.FC<CustomRenderElementProps<IBlockCode>> = ({ attributes, children, element }) => {
  const isSelected = useSelected()
  const editor = useSlateStatic()

  const langOptions: KeysUnion<ICodeAreaLangMap>[] = Object.keys(codeAreaLangMap) as KeysUnion<ICodeAreaLangMap>[]

  const [containerDom, setContainerDom] = useState<HTMLElement>()
  const [ifEditable, setIfEditable] = useState<false | undefined>(false)

  // 用于将用户选区限制在代码块内
  useEffect(() => {
    if (containerDom) {
      const controller = new AbortController()

      containerDom.addEventListener(
        "mousedown",
        () => {
          setIfEditable(undefined)

          containerDom.addEventListener(
            "mouseleave",
            () => {
              setIfEditable(false)
            },
            {
              once: true,
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

              containerDom.addEventListener(
                "mouseleave",
                () => {
                  setIfEditable(false)
                },
                {
                  once: true,
                }
              )
            },
            {
              once: true,
            }
          )
        },
        {
          signal: controller.signal,
        }
      )

      return () => {
        controller.abort()
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
        border: isSelected ? "1px solid #5a87f7" : undefined,
      }}
      className={blockCodeContainer}
      contentEditable={ifEditable}
    >
      <div
        contentEditable={false}
        style={{
          userSelect: "none",
        }}
      >
        <Select
          defaultValue={(SlateNode.child(element, 1) as IBlockCode_CodeArea).langKey}
          style={{ width: 154 }}
          onChange={(value) => {
            const codeArea = SlateNode.child(element, 1)
            const codeAreaPath = ReactEditor.findPath(editor, codeArea)
            Transforms.setNodes(
              editor,
              {
                langKey: value,
              },
              {
                at: codeAreaPath,
              }
            )
          }}
        >
          {langOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default BlockCode
