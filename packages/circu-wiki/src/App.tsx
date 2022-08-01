import { CircuEditor, CircuProvider } from "circu-editor"

const App: React.FC = () => {
  return (
    <div className={"h-screen"}>
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
  )
}

export default App
