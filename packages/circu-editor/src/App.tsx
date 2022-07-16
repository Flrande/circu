import { faker } from "@faker-js/faker"
import { useSetAtom } from "jotai"
import { useState } from "react"
import type { Descendant } from "slate"
import { ReactEditor, Slate } from "slate-react"
import { doc, docContainer } from "./App.css"
import FoldButton from "./slate/components/FoldButton/FoldButton"
import { foldStateAtom } from "./slate/components/FoldButton/state"
import OrderedListBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListBar"
import OrderedListModifyBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListModifyBar"
import LinkBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkBar"
import LinkEditBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkEditBar"
import LinkButtonBar from "./slate/components/ToolBar/components/Link/LinkButtonBar"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { useCreateEditor } from "./slate/hooks/useCreateEditor"
import SlateEditable from "./slate/SlateEditable"
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
  const setFoldState = useSetAtom(foldStateAtom)

  const [value, setValue] = useState<Descendant[]>(initialValue)

  return (
    <div className={docContainer}>
      <div
        onMouseMove={(event) => {
          // 文档左右两边到视口的距离, 790 为文档宽度
          const docXPadding = (document.documentElement.clientWidth - 790) / 2
          let x = event.clientX
          const y = event.clientY

          // 60 的取值随意, 能在文档内就行
          if (x <= docXPadding) {
            x = docXPadding + 60
          }
          if (x >= docXPadding + 790) {
            x = docXPadding + 790 - 60
          }

          const elements = document.elementsFromPoint(x, y)
          const blockContentIndex = elements.findIndex(
            (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block-content"
          )

          if (blockContentIndex !== -1) {
            const goalDomElement = elements
              .slice(blockContentIndex + 1)
              .find((ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["slateNode"] === "element")

            if (goalDomElement) {
              const goalNode = ReactEditor.toSlateNode(editor, goalDomElement)
              const goalPath = ReactEditor.findPath(editor, goalNode)

              if (SlateElement.isElement(goalNode)) {
                const rect = goalDomElement.getBoundingClientRect()
                setFoldState({
                  path: goalPath,
                  left: rect.left - docXPadding - 20,
                  top: rect.top + window.scrollY + 1,
                })
              }
            }
          }
        }}
        onMouseLeave={() => {
          setFoldState(null)
        }}
        style={{
          padding: "0 96px 0 96px",
        }}
      >
        <div className={doc}>
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
