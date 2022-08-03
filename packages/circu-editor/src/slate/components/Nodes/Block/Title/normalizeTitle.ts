import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"

/**
 * 用于保证首个块级节点是标题
 *
 * @param editor 编辑器实例
 * @param entry 当前 entry
 *
 */
export const normalizeTitle = (editor: Editor, entry: NodeEntry): void => {
  Editor.withoutNormalizing(editor, () => {
    const [node] = entry

    if (Editor.isEditor(node)) {
      const [firstNode] = Editor.node(editor, [0])

      if (!SlateElement.isElement(firstNode) || firstNode.type !== "title") {
        Transforms.insertNodes(
          editor,
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
                        text: "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            at: [0],
          }
        )
      }
    }
  })
}
