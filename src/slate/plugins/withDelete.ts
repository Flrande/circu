import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../types/slate"

const withDeleteBackward = (editor: Editor) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    const { selection } = editor

    if (selection) {
      // 当前 BlockNode
      const [currentBlockNode, currentBlockNodePath] = Editor.node(editor, selection, {
        depth: 1,
      })

      // --------------------------------------------------
      // 若当前 BlockNode 为 paragraph
      // --------------------------------------------------
      if (SlateElement.isElement(currentBlockNode) && currentBlockNode.type === "paragraph") {
        // 拿到前一个 BlockNode (深度为 1)
        const previousNodeEntry = Editor.previous(editor, {
          match: (n) => !Editor.isEditor(n),
          mode: "highest",
        })

        // 若前一个 BlockNode 为 blockCode
        if (
          previousNodeEntry &&
          SlateElement.isElement(previousNodeEntry[0]) &&
          previousNodeEntry[0].type === "blockCode"
        ) {
          // 选中该 blockCode, 不删除
          Transforms.select(editor, previousNodeEntry[1])
          return
        }

        // --------------------------------------------------
        // 若当前 BlockNode 为 blockCode
        // --------------------------------------------------
      } else if (SlateElement.isElement(currentBlockNode) && currentBlockNode.type === "blockCode") {
        // 若到达当前 Block 的首个 Point, 静默, 不删除
        if (
          SlateRange.isCollapsed(selection) &&
          // 判断是否为首行
          selection.anchor.path[selection.anchor.path.length - 2] === 0 &&
          selection.anchor.offset === 0
        ) {
          return
        }

        // --------------------------------------------------
        // 若当前 BlockNode 为 list
        // --------------------------------------------------
      } else if (SlateElement.isElement(currentBlockNode) && currentBlockNode.type === "list") {
        // 判断是否到达 list 的首个 Point
        if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
          // 若 list 的 listType 不为 noindex,
          // 触发 deleteBackward 相当于将当前 list 的类型转为 noindex
          if (currentBlockNode.listType !== "noindex") {
            Transforms.setNodes(
              editor,
              {
                listType: "noindex",
                orderedListMode: undefined,
                index: undefined,
                headIndex: undefined,
              },
              {
                at: currentBlockNodePath,
              }
            )
            return

            // 若 list 的 listType 为 noindex,
            // 触发 deleteBackward 相当于将当前 list 转化为 paragraph
          } else if (currentBlockNode.listType === "noindex") {
            Transforms.setNodes(
              editor,
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
              {
                at: currentBlockNodePath,
              }
            )
            return
          }
        }
      }
    }

    deleteBackward(unit)
  }

  return editor
}

const withDeleteFragment = (editor: Editor) => {
  const { deleteFragment } = editor

  editor.deleteFragment = (direction?: "forward" | "backward") => {
    deleteFragment(direction)
    const sel = window.getSelection()
    sel?.removeAllRanges()
  }

  return editor
}

export const withDelete = (editor: Editor) => {
  return withDeleteFragment(withDeleteBackward(editor))
}
