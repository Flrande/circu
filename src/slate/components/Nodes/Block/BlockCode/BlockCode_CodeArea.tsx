import { useEffect, useState } from "react"
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
      const controller = new AbortController()

      containerDom.addEventListener(
        "mousedown",
        () => {
          const mouseleaveController = new AbortController()
          setIfEditable(undefined)

          containerDom.addEventListener(
            "mouseleave",
            () => {
              setIfEditable(false)
            },
            {
              signal: mouseleaveController.signal,
            }
          )

          document.addEventListener(
            "mouseup",
            () => {
              setIfEditable(undefined)
              mouseleaveController.abort()
            },
            {
              signal: mouseleaveController.signal,
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
        width: "100%",
      }}
      contentEditable={ifEditable}
    >
      {children}
    </div>
  )
}

export default BlockCode_CodeArea
