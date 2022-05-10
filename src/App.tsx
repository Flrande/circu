import { useState } from "react"
import type { Descendant } from "slate"
import { Slate } from "slate-react"
import { doc, docContainer } from "./App.css"
import LinkBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkBar"
import LinkEditBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkEditBar"
import LinkButtonBar from "./slate/components/ToolBar/components/Link/LinkButtonBar"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { useCreateEditor } from "./slate/hooks/useCreateEditor"
import SlateEditable from "./slate/SlateEditable"

const App: React.FC = () => {
  const editor = useCreateEditor()
  const [value, setValue] = useState<Descendant[]>([
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
  ])

  return (
    <div className={docContainer}>
      <div className={doc}>
        <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <SlateEditable></SlateEditable>
          <ToolBar></ToolBar>
          <LinkButtonBar></LinkButtonBar>
          <LinkBar></LinkBar>
          <LinkEditBar></LinkEditBar>
        </Slate>
      </div>
    </div>
  )
}

export default App
