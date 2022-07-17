import type { Editor } from "slate"
import { normalizeOrderedList } from "../components/Nodes/Block/List/normalizeList"

//TODO: 新增约束: 子节点块不能为空
export const withNormalize = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    normalizeOrderedList(editor, entry)

    normalizeNode(entry)
  }

  return editor
}
