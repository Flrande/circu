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
    <div className={"grid grid-rows-[56px_auto] h-full"}>
      <div className={"bg-[#1a1a1a] border-b border-[#5f5f5f]"}></div>
      <div>
        <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
      </div>
    </div>
  )
}

export default Doc
