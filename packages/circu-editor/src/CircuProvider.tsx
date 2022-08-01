import { atom, Provider } from "jotai"
import type { Descendant } from "slate"

export const editorRootIdAtom = atom("")

// 用于在外部初始化编辑器
export type initialState = {
  editorValue: Descendant[]
}
export const initialStateAtom = atom<initialState>({
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
})

const CircuProvider: React.FC<
  React.PropsWithChildren<{
    id: string
    initialState: initialState
  }>
> = ({ id, initialState, children }) => {
  return (
    <Provider
      initialValues={[
        [editorRootIdAtom, `circu-editor-${id}-root`],
        [initialStateAtom, initialState],
      ]}
    >
      {children}
    </Provider>
  )
}

export default CircuProvider
