import { faker } from "@faker-js/faker"
import { useState } from "react"
import type { Descendant } from "slate"
import { Slate } from "slate-react"
import { doc, docContainer } from "./App.css"
import OrderedListBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListBar"
import OrderedListModifyBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListModifyBar"
import LinkBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkBar"
import LinkEditBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkEditBar"
import LinkButtonBar from "./slate/components/ToolBar/components/Link/LinkButtonBar"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { useCreateEditor } from "./slate/hooks/useCreateEditor"
import SlateEditable from "./slate/SlateEditable"

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
                  text: faker.lorem.paragraph(),
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
  const [value, setValue] = useState<Descendant[]>(initialValue)

  return (
    <div className={docContainer}>
      <div className={doc}>
        <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <SlateEditable></SlateEditable>
          <div
            // 拦截冒泡的 mousedown 事件, 防止 ToolBar 工作异常
            onMouseDown={(event) => {
              event.stopPropagation()
            }}
          >
            {/* <ToolBar></ToolBar>
            <LinkButtonBar></LinkButtonBar>
            <LinkBar></LinkBar>
            <LinkEditBar></LinkEditBar>
            <OrderedListBar></OrderedListBar>
            <OrderedListModifyBar></OrderedListModifyBar> */}
          </div>
        </Slate>
      </div>
    </div>
  )
}

export default App
