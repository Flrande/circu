import { Editor, NodeEntry, Transforms } from "slate"
import { useSlate } from "slate-react"
import { SlateElement, SlateNode, SlateRange } from "../../../../types/slate"

/**
 * 处理列表中换行行为的钩子
 * @returns 1个函数, 仅负责修改 model, 不负责覆盖默认操作
 */
export const useListLineFeed = () => {
  const editor = useSlate()

  return () => {
    const selectedNodeEntryArr = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n),
      })
    ) as NodeEntry<SlateElement>[]

    if (
      editor.selection &&
      SlateRange.isCollapsed(editor.selection) &&
      selectedNodeEntryArr.length === 1 &&
      SlateElement.isElement(selectedNodeEntryArr[0][0]) &&
      selectedNodeEntryArr[0][0].type === "list"
    ) {
      // 当前光标所在的 list
      const [selectedList, selectedListPath] = selectedNodeEntryArr[0]

      // 若当前 list 为有序列表, 换行后新产生 list 的 orderedListMode
      // 应为 selfIncrement
      if (selectedList.listType === "ordered") {
        Transforms.splitNodes(editor, { always: true })

        const newListPath = editor.selection.anchor.path.slice(0, 1)
        Transforms.setNodes(
          editor,
          {
            orderedListMode: "selfIncrement",
          },
          {
            at: newListPath,
          }
        )
      } else if (selectedList.listType === "noindex") {
        // 若当前 list 类型为 noindex 且 list 内文本为空,
        // 换行相当于将当前 list 转化为 paragraph
        if (SlateNode.string(selectedList).length === 0) {
          Transforms.setNodes(
            editor,
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
            {
              at: selectedListPath,
            }
          )

          // 若文本不为空, 换行产生一个新的 ordered list
        } else {
          Transforms.splitNodes(editor, { always: true })

          const newListPath = editor.selection.anchor.path.slice(0, 1)
          Transforms.setNodes(
            editor,
            {
              listType: "ordered",
              orderedListMode: "selfIncrement",
              index: 1,
            },
            {
              at: newListPath,
            }
          )
        }
      } else {
        Transforms.splitNodes(editor, { always: true })
      }
    } else {
      Transforms.splitNodes(editor, { always: true })
    }
  }
}
