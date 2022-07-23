import { faker } from "@faker-js/faker"
import { useSetAtom } from "jotai"
import { useState } from "react"
import type { Descendant } from "slate"
import { ReactEditor, Slate } from "slate-react"
import FoldButton from "./slate/components/FoldButton/FoldButton"
import OrderedListBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListBar"
import OrderedListModifyBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListModifyBar"
import LinkBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkBar"
import LinkEditBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkEditBar"
import LinkButtonBar from "./slate/components/ToolBar/components/Link/LinkButtonBar"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { useCreateEditor } from "./slate/hooks/useCreateEditor"
import SlateEditable from "./slate/SlateEditable"
import { mouseXBlockPathAtom } from "./slate/state/mouse"
import { DOC_WIDTH } from "./slate/types/constant"
import { SlateElement } from "./slate/types/slate"

let initialValue: Descendant[] = []
if (import.meta.env.VITE_INITIAL_VALUE_MODE === "dev") {
  for (let p = 0; p < 50; p++) {
    initialValue.push({
      type: "paragraph",
      children: [
        {
          type: "__block-element-content",
          children: [
            {
              type: "text-line",
              children: [
                {
                  text: `${p + 1} ` + faker.lorem.paragraph(),
                },
              ],
            },
          ],
        },
      ],
    })
  }
} else if (import.meta.env.VITE_INITIAL_VALUE_MODE === "huge") {
  for (let i = 0; i < 100; i++) {
    for (let p = 0; p < 50; p++) {
      initialValue.push({
        type: "paragraph",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: faker.lorem.paragraph(),
                  },
                ],
              },
            ],
          },
        ],
      })
    }
  }
} else {
  initialValue = [
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
                  text: faker.lorem.paragraph(),
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}

const App: React.FC = () => {
  const editor = useCreateEditor()
  const setMouseXBlockPath = useSetAtom(mouseXBlockPathAtom)

  const [value, setValue] = useState<Descendant[]>(initialValue)

  return (
    <div className={"flex justify-center bg-neutral-900"}>
      <div
        onMouseMove={(event) => {
          // 文档左右两边到视口的距离
          const docXPadding = (document.documentElement.clientWidth - DOC_WIDTH) / 2
          let x = event.clientX
          const y = event.clientY

          // 60 的取值随意, 能在文档内就行
          if (x <= docXPadding) {
            x = docXPadding + 60
          }
          if (x >= docXPadding + DOC_WIDTH) {
            x = docXPadding + DOC_WIDTH - 60
          }

          const elements = document.elementsFromPoint(x, y)
          const blockContentIndex = elements.findIndex(
            (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block-content"
          )

          if (blockContentIndex !== -1) {
            // 鼠标水平方向对应的块级节点的 dom 元素
            const goalDomElement = elements
              .slice(blockContentIndex + 1)
              .find((ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["slateNode"] === "element")

            if (goalDomElement) {
              const goalNode = ReactEditor.toSlateNode(editor, goalDomElement)

              if (SlateElement.isElement(goalNode)) {
                const goalPath = ReactEditor.findPath(editor, goalNode)

                setMouseXBlockPath(goalPath)
              }
            }
          }
        }}
        onMouseLeave={() => {
          setMouseXBlockPath(null)
        }}
        style={{
          padding: "0 96px 0 96px",
        }}
      >
        <div
          className={"relative text-base text-slate-50 tracking-wide p-4"}
          style={{
            width: `${DOC_WIDTH}px`,
          }}
        >
          <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
            <SlateEditable></SlateEditable>
            <div
              // 拦截冒泡的 mousedown 事件, 防止 ToolBar 工作异常
              onMouseDown={(event) => {
                event.stopPropagation()
              }}
            >
              <ToolBar></ToolBar>
              <LinkButtonBar></LinkButtonBar>
              <LinkBar></LinkBar>
              <LinkEditBar></LinkEditBar>
              <OrderedListBar></OrderedListBar>
              <OrderedListModifyBar></OrderedListModifyBar>
              <FoldButton></FoldButton>
            </div>
          </Slate>
        </div>
      </div>
    </div>
  )
}

export default App
