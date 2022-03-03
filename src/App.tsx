import { useState } from "react"
import { createEditor, Descendant } from "slate"
import { Slate, withReact } from "slate-react"
import { doc, docContainer } from "./App.css"
import { withInlines } from "./slate/plugins/withInlines"
import SlateEditable from "./slate/SlateEditable"

const App: React.FC = () => {
  const [editor] = useState(() => withInlines(withReact(createEditor()))) // 保证单一实例
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [
        {
          text: "A line of text in a paragraph.",
        },
      ],
    },
  ])

  return (
    <div className={docContainer}>
      <div className={doc}>
        <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <SlateEditable></SlateEditable>
        </Slate>
      </div>
    </div>
  )
}

export default App
