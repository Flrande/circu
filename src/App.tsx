import { useState } from "react"
import type { Descendant } from "slate"
import { Slate } from "slate-react"
import { doc, docContainer } from "./App.css"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { useCreateEditor } from "./slate/hooks/useCreateEditor"
import SlateEditable from "./slate/SlateEditable"

const App: React.FC = () => {
  const editor = useCreateEditor()
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
