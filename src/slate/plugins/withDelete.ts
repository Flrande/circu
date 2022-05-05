import { Editor, Transforms } from "slate"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import { SlateElement, SlateRange } from "../types/slate"

//TODO：将各个元素相关的逻辑拆分出来

// 每段逻辑进行完成后要记得 return
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
        // 如果当前段落带有缩进, 在首个 Point 上触发 deleteBackward 时相当于将当前段落的缩进
        // 级别设为 0
        if (currentBlockNode.indentLevel !== 0) {
          if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
            Transforms.setNodes(
              editor,
              {
                indentLevel: 0,
              },
              {
                at: currentBlockNodePath,
              }
            )
            return
          }
        } else {
          const previousNodeEntry = Editor.previous(editor, {
            match: (n) => !Editor.isEditor(n),
            mode: "highest",
          })

          // 若光标前为 blockCode, 选中该 blockCode, 不删除
          if (
            previousNodeEntry &&
            SlateElement.isElement(previousNodeEntry[0]) &&
            previousNodeEntry[0].type === "blockCode"
          ) {
            Transforms.select(editor, previousNodeEntry[1])
            return
          }
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
        // 若当前 BlockNode 为 orderedList 或者 unorderedList
        // --------------------------------------------------
      } else if (
        SlateElement.isElement(currentBlockNode) &&
        (currentBlockNode.type === "orderedList" || currentBlockNode.type === "unorderedList")
      ) {
        // 判断是否到达有序列表的首个 Point
        if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
          // 触发 deleteBackward 相当于将当前列表变为同缩进级别的 paragraph
          Transforms.removeNodes(editor, {
            at: currentBlockNodePath,
          })

          const newNode: IParagraph = {
            type: "paragraph",
            indentLevel: currentBlockNode.indentLevel,
            children: currentBlockNode.children,
          }

          Transforms.insertNodes(editor, newNode, {
            at: currentBlockNodePath,
          })
          Transforms.select(editor, Editor.start(editor, currentBlockNodePath))
          return
        }
      }
    }

    // 默认行为
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
