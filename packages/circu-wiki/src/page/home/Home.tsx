import { CircuEditor, CircuProvider } from "circu-editor"

const Home: React.FC = () => {
  return (
    <div className={"flex w-screen h-screen"}>
      <div className={"basis-72 shrink-0 bg-zinc-800"}></div>
      <div className={"grow"}>
        <CircuProvider
          id="1"
          initialState={{
            editorValue: [
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
                            text: "",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        >
          <CircuEditor></CircuEditor>
        </CircuProvider>
      </div>
    </div>
  )
}

export default Home
