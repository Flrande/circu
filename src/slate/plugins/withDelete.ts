import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../types/slate"

// selection 在一个 Paragraph 中, 前一个 Block Node 为 blockCode,
// 触发 deleteBackward 时选中 blockCode, 再次触发 deleteBackward 时删除它

const withDeleteBackward = (editor: Editor) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    const { selection } = editor

    if (selection) {
      // 拿到当前 BlockNode
      const currentBlockNodeEntry = Editor.node(editor, selection, {
        depth: 1,
      })

      // 若当前 BlockNode 为 paragraph
      if (SlateElement.isElement(currentBlockNodeEntry[0]) && currentBlockNodeEntry[0].type === "paragraph") {
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
          // 选中该 blockCode
          Transforms.select(editor, previousNodeEntry[1])
        } else {
          deleteBackward(unit)
        }
      }
      // 若当前 BlockNode 为 blockCode
      else if (SlateElement.isElement(currentBlockNodeEntry[0]) && currentBlockNodeEntry[0].type === "blockCode") {
        // 若到达当前 Block 的 首个 Point, 静默, 不删除
        if (
          SlateRange.isCollapsed(selection) &&
          // 判断是否为首行
          selection.anchor.path[selection.anchor.path.length - 2] === 0 &&
          selection.anchor.offset === 0
        ) {
        } else {
          deleteBackward(unit)
        }
      } else {
        deleteBackward(unit)
      }
    } else {
      deleteBackward(unit)
    }
  }

  return editor
}

const withDeleteFragment = (editor: Editor) => {
  const { deleteFragment } = editor

  editor.deleteFragment = (direction?: "forward" | "backward") => {
    const { selection } = editor

    if (selection) {
      // 拿到当前 BlockNode
      const currentBlockNodeEntry = Editor.node(editor, selection, {
        depth: 1,
      })

      // 若当前 BlockNode 为 blockCode 且 selection 包含 blockCode 空白标记块, 删除该 blockCode
      if (
        SlateElement.isElement(currentBlockNodeEntry[0]) &&
        currentBlockNodeEntry[0].type === "blockCode" &&
        SlateRange.includes(selection, [currentBlockNodeEntry[1][1], 2])
      ) {
        Transforms.removeNodes(editor, {
          at: currentBlockNodeEntry[1],
        })
        const sel = window.getSelection()
        sel?.removeAllRanges()
      } else {
        deleteFragment(direction)
      }
    } else {
      deleteFragment(direction)
    }
  }

  return editor
}

export const withDelete = (editor: Editor) => {
  return withDeleteFragment(withDeleteBackward(editor))
}
