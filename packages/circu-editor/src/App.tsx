import { faker } from "@faker-js/faker"
import { useSetAtom } from "jotai"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Descendant } from "slate"
import { ReactEditor, Slate } from "slate-react"
import Draggable from "./slate/components/Draggable/Draggable"
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
    <DndProvider backend={HTML5Backend}>
      <div className={"flex justify-center bg-neutral-900"}>
        <div
          onMouseMove={(event) => {
            // 文档左右两边到视口的距离
            const docXPadding = (document.documentElement.clientWidth - DOC_WIDTH) / 2
            const y = event.clientY

            // 60 的取值随意, 确保水平位置不受缩进影响即可
            const elements = document.elementsFromPoint(docXPadding + DOC_WIDTH - 60, y)
            // 鼠标水平方向对应的块级节点的 dom 元素
            const blockDom = elements.find(
              (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block"
            )

            const spaceDom = elements.find(
              (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block-space"
            )

            if (spaceDom && spaceDom.parentElement) {
              const blockNode = ReactEditor.toSlateNode(editor, spaceDom.parentElement)

              if (SlateElement.isElement(blockNode)) {
                const blockPath = ReactEditor.findPath(editor, blockNode)

                setMouseXBlockPath(blockPath)
              }

              return
            }

            if (blockDom) {
              const blockNode = ReactEditor.toSlateNode(editor, blockDom)

              if (SlateElement.isElement(blockNode)) {
                const blockPath = ReactEditor.findPath(editor, blockNode)

                setMouseXBlockPath(blockPath)
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
                <Draggable></Draggable>
              </div>
            </Slate>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default App
