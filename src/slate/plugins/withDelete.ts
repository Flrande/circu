import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../types/slate"

//TODO：将各个元素相关的逻辑拆分出来
//TODO: 多级列表
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
        // 若当前 BlockNode 为 orderedList
        // --------------------------------------------------
      } else if (SlateElement.isElement(currentBlockNode) && currentBlockNode.type === "orderedList") {
        // 判断是否到达有序列表的首个 Point
        if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
          // 若有序列表不为无索引
          // 触发 deleteBackward 相当于将当前有序列表变为无索引
          if (currentBlockNode.indexState.type !== "noIndex") {
            Transforms.setNodes(
              editor,
              {
                indexState: {
                  type: "noIndex",
                },
              },
              {
                at: currentBlockNodePath,
              }
            )
            return

            // 若有序列表为有索引
            // 触发 deleteBackward 相当于将当前 orderedList 变为 paragraph
          } else if (currentBlockNode.indexState.type === "noIndex") {
            Transforms.setNodes(
              editor,
              {
                type: "paragraph",
              },
              {
                at: currentBlockNodePath,
              }
            )
            return
          }
        }

        // --------------------------------------------------
        // 若当前 BlockNode 为 unorderedList
        // --------------------------------------------------
      } else if (SlateElement.isElement(currentBlockNode) && currentBlockNode.type === "unorderedList") {
        // 判断是否到达无序列表的首个 Point
        if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, currentBlockNodePath)) {
          // 若有序列表不为无索引
          // 触发 deleteBackward 相当于将当前有序列表变为无索引
          if (currentBlockNode.indexState !== "noIndex") {
            Transforms.setNodes(
              editor,
              {
                indexState: "noIndex",
              },
              {
                at: currentBlockNodePath,
              }
            )
            return

            // 若无序列表为有索引
            // 触发 deleteBackward 相当于将当前 unorderedList 变为 paragraph
          } else if (currentBlockNode.indexState === "noIndex") {
            Transforms.setNodes(
              editor,
              {
                type: "paragraph",
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
