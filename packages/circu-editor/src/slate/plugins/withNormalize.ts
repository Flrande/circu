import type { Editor } from "slate"
import { normalizeOrderedList } from "../components/Nodes/Block/List/normalizeList"

//TODO: 新增约束: 同深度下, 折叠状态的标题节点后只能有同级别的标题节点被渲染, 否则应解除折叠状态
export const withNormalize = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    normalizeOrderedList(editor, entry)

    normalizeNode(entry)
  }

  return editor
}
