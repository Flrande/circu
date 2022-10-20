import { CircuEditor, CustomElement, CustomText, useCircuEditor } from "circu-editor"
import { useState } from "react"

const Doc: React.FC = () => {
  const editor = useCircuEditor()

  const [value, setValue] = useState<(CustomElement | CustomText)[]>([
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

  return (
    <div className={"flex-1 bg-transparent h-full relative"}>
      <div className={"h-full pt-14"}>
        <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
      </div>
    </div>
  )
}

export default Doc
