import { faker } from "@faker-js/faker"
import { useState } from "react"
import type { Descendant } from "slate"
import { CircuEditor } from "./CircuEditor"
import { useCircuEditor } from "./slate/hooks/useCircuEditor"

let initialValue: Descendant[] = [
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
]
if (import.meta.env.VITE_INITIAL_VALUE_MODE === "dev") {
  let k = 0
  for (let p = 0; p < 50; p++) {
    k++
    initialValue.push({
      type: "paragraph",
      children: [
        {
          type: "__block-element-content",
          children: [
            {
              type: "text-line",
              children: [
                {
                  text: `${k} ` + faker.lorem.sentence(),
                },
              ],
            },
          ],
        },
      ],
    })
  }
} else if (import.meta.env.VITE_INITIAL_VALUE_MODE === "huge") {
  let k = 0
  for (let i = 0; i < 100; i++) {
    for (let p = 0; p < 50; p++) {
      k++
      initialValue.push({
        type: "paragraph",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: `${k} ` + faker.lorem.sentence(),
                  },
                ],
              },
            ],
          },
        ],
      })
    }
  }
} else {
  initialValue = [
    {
      type: "paragraph",
      children: [
        {
          type: "__block-element-content",
          children: [
            {
              type: "text-line",
              children: [
                {
                  text: faker.lorem.paragraph(),
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}

const App: React.FC = () => {
  const editor = useCircuEditor()
  const [value, setValue] = useState<Descendant[]>(initialValue)

  return <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
}

export default App
