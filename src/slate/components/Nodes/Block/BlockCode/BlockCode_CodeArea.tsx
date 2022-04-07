import { useEffect, useState } from "react"
import { ReactEditor, useSlate } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IBlockCode_CodeArea } from "./types"

const BlockCode_CodeArea: React.FC<CustomRenderElementProps<IBlockCode_CodeArea>> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlate()
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
              signal: controller.signal,
            }
          )
        },
        {
          signal: controller.signal,
        }
      )

      document.addEventListener(
        "mouseup",
        () => {
          setIfEditable(undefined)
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
        width: "100%",
      }}
      contentEditable={ifEditable}
    >
      {children}
    </div>
  )
}

export default BlockCode_CodeArea
