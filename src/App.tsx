import { useState } from "react"
import { createEditor, Descendant } from "slate"
import { Slate, withReact } from "slate-react"
import { doc, docContainer } from "./App.css"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { withDelete } from "./slate/plugins/withDelete"
import { withInlines } from "./slate/plugins/withInlines"
import { withVoid } from "./slate/plugins/withVoid"
import SlateEditable from "./slate/SlateEditable"

const App: React.FC = () => {
  const [editor] = useState(() => withVoid(withDelete(withInlines(withReact(createEditor()))))) // 保证单一实例
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [
        {
          text: "A line of text in a paragraph. - 1",
        },
      ],
      isVoid: false,
    },
    {
      type: "blockCode",
      lang: "PlainText",
      children: [
        {
          type: "paragraph",
          children: [
            {
              text: "",
            },
          ],
          isVoid: true,
        },
        {
          type: "blockCode_codeArea",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  text: "A line of code.",
                },
              ],
              isVoid: false,
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: "",
            },
          ],
          isVoid: true,
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "A line of text in a paragraph. - 2",
        },
      ],
      isVoid: false,
    },
    {
      type: "paragraph",
      children: [
        {
          text: "A line of text in a paragraph. - 3",
        },
      ],
      isVoid: false,
    },
  ])

  return (
    <div className={docContainer}>
      <div className={doc}>
        <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <SlateEditable></SlateEditable>
          <ToolBar></ToolBar>
        </Slate>
      </div>
    </div>
  )
}

export default App
