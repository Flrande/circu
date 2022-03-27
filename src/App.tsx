import { useState } from "react"
import type { Descendant } from "slate"
import { Slate } from "slate-react"
import { doc, docContainer } from "./App.css"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { useCreateEditor } from "./slate/hooks/useCreateEditor"
import SlateEditable from "./slate/SlateEditable"

//TODO: 用 useSlateStatic 替代 useSlate 减少重渲染
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
          lang: "Javascript",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  text: "const tmp = 1",
                },
              ],
            },
            {
              type: "paragraph",
              children: [
                {
                  text: "const foo = 2",
                },
              ],
            },
            {
              type: "paragraph",
              children: [
                {
                  text: "console.log(tmp + foo)",
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
      children: [
        {
          text: "A line of text in a paragraph. - 2",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "A line of text in a paragraph. - 3",
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
        </Slate>
      </div>
    </div>
  )
}

export default App
