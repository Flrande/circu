import type { Editor } from "slate"
import { normalizeOrderedList } from "../components/Nodes/Block/List/normalizeList"
import { normalizeTitle } from "../components/Nodes/Block/Title/normalizeTitle"

//TODO: 新增约束: 子节点块不能为空
export const withNormalize = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    normalizeTitle(editor, entry)
    normalizeOrderedList(editor, entry)

    normalizeNode(entry)
  }

  return editor
}
