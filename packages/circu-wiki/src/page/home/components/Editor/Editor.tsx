import { CircuEditor, useCircuEditor } from "circu-editor"
import { useEffect, useState } from "react"
import type { Descendant } from "slate"
import ScrollBar from "smooth-scrollbar"

const Editor: React.FC = () => {
  const editor = useCircuEditor()
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "title",
      children: [
        {
          type: "__block-element-content",
          children: [
            {
              type: "text-line",
              children: [
                {
                  text: "Demo",
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  useEffect(() => {
    ScrollBar.init(document.getElementById("editor-root")!)
  }, [])

  return (
    <div id="editor-root" className={"grow bg-neutral-900 h-screen"}>
      <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
    </div>
  )
}

export default Editor
