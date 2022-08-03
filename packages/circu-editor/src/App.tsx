import { faker } from "@faker-js/faker"
import type { Descendant } from "slate"
import CircuEditor from "./CircuEditor"
import CircuProvider from "./CircuProvider"

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
  return (
    <CircuProvider id="1" initialState={{ editorValue: initialValue }}>
      <CircuEditor></CircuEditor>
    </CircuProvider>
  )
}

export default App
