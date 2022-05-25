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
  initialValue = [
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 1",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 2",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 3",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 4",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 5",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 6",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 7",
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "A line of text in a paragraph. - 8",
        },
      ],
    },
    {
      type: "blockCode",
      children: [
        {
          type: "blockCode_voidArea",
          children: [
            {
              text: "",
            },
          ],
        },
        {
          type: "blockCode_codeArea",
          langKey: "Javascript",
          children: [
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'import React from "react"',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'import * as ReactDOMClient from "react-dom/client"',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'import App from "./App"',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'import "./normalize.css"',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'document.body.setAttribute("arco-theme", "dark")',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'const container = document.getElementById("root")',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: 'if (!container) throw "Can\'t find root dom."',
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "const root = ReactDOMClient.createRoot(container)",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "root.render(",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "  <React.StrictMode>",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "    <App />",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: "  </React.StrictMode>",
                },
              ],
            },
            {
              type: "blockCode_codeLine",
              children: [
                {
                  text: ")",
                },
              ],
            },
          ],
        },
        {
          type: "blockCode_voidArea",
          children: [
            {
              text: "",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "",
        },
      ],
    },
  ]
} else if (import.meta.env.VITE_INITIAL_VALUE_MODE === "huge") {
  for (let i = 0; i < 100; i++) {
    for (let p = 0; p < 50; p++) {
      initialValue.push({
        type: "paragraph",
        indentLevel: 0,
        children: [{ text: faker.lorem.paragraph() }],
      })
    }
    // initialValue.push({
    //   type: "blockCode",
    //   children: [
    //     {
    //       type: "blockCode_voidArea",
    //       children: [
    //         {
    //           text: "",
    //         },
    //       ],
    //     },
    //     {
    //       type: "blockCode_codeArea",
    //       langKey: "Javascript",
    //       children: [
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'import React from "react"',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'import * as ReactDOMClient from "react-dom/client"',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'import App from "./App"',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'import "./normalize.css"',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'document.body.setAttribute("arco-theme", "dark")',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'const container = document.getElementById("root")',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: 'if (!container) throw "Can\'t find root dom."',
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "const root = ReactDOMClient.createRoot(container)",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "root.render(",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "  <React.StrictMode>",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "    <App />",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: "  </React.StrictMode>",
    //             },
    //           ],
    //         },
    //         {
    //           type: "blockCode_codeLine",
    //           children: [
    //             {
    //               text: ")",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       type: "blockCode_voidArea",
    //       children: [
    //         {
    //           text: "",
    //         },
    //       ],
    //     },
    //   ],
    // })
  }
} else {
  initialValue = [
    {
      type: "paragraph",
      indentLevel: 0,
      children: [
        {
          text: "",
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
            <ToolBar></ToolBar>
            <LinkButtonBar></LinkButtonBar>
            <LinkBar></LinkBar>
            <LinkEditBar></LinkEditBar>
            <OrderedListBar></OrderedListBar>
            <OrderedListModifyBar></OrderedListModifyBar>
          </div>
        </Slate>
      </div>
    </div>
  )
}

export default App
