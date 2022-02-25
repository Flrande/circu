import { useCallback, useState } from "react"
import { createEditor, Descendant } from "slate"
import { Editable, RenderElementProps, Slate, withReact } from "slate-react"
import { doc, docContainer } from "./App.css"
import Leaf from "./slate/components/Leaf"
import ParagraphElement from "./slate/components/ParagraphElement"
import { toggleMark } from "./slate/utils"

const App: React.FC = () => {
  const [editor] = useState(() => withReact(createEditor())) // 保证单一实例
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

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <ParagraphElement {...props}></ParagraphElement>
    }
  }, [])

  const renderLeaf = useCallback((props) => <Leaf {...props}></Leaf>, [])

  return (
    <div className={docContainer}>
      <div className={doc}>
        <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (!event.altKey) return

              switch (event.key) {
                case "q":
                case "Q":
                  event.preventDefault()
                  toggleMark(editor, "code")
                  break
                case "w":
                case "W":
                  event.preventDefault()
                  toggleMark(editor, "bold")
                  break
              }
            }}
          />
        </Slate>
      </div>
    </div>
  )
}

export default App
