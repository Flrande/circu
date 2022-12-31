import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { useMouseXBlockDetect } from "../../../../state/mouse"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IQuote } from "./types"

const Quote: React.FC<CustomRenderElementProps<IQuote>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const quotePath = ReactEditor.findPath(editor, element)

  const { onMouseEnterForDrag, onMouseLeaveForDrag } = useMouseXBlockDetect(element)

  return (
    <div
      {...attributes}
      onMouseEnter={onMouseEnterForDrag}
      onMouseLeave={onMouseLeaveForDrag}
      className={"pl-[14px] relative text-zinc-400"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      {quotePath.at(-1) !== 0 && (
        <div
          // 点击两个相邻引用块的中间区域, 插入一个空行
          onClick={() => {
            Transforms.insertNodes(
              editor,
              {
                type: "paragraph",
                children: [
                  {
                    type: "__block-element-content",
                    children: [
                      {
                        type: "text-line",
                        children: [
                          {
                            text: "",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                at: ReactEditor.findPath(editor, element),
              }
            )
          }}
          contentEditable={false}
          className={"absolute left-0 -top-2 w-full h-2 select-none"}
        ></div>
      )}
      <div className={"h-full absolute border-l-2 border-solid border-zinc-500 rounded-[1px] left-0"}></div>
      <div className={"circu-quote"}>{children}</div>
    </div>
  )
}

export default Quote
