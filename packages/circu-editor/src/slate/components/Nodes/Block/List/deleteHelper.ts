import { Editor, NodeEntry, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import { SlateElement, SlateRange } from "../../../../types/slate"

/**
 * 处理列表中单字符删除相关的逻辑:
 * 1. 如果光标为列表的首个 Point, 触发 deleteBackward 相当于将当前列表变为同缩进级别的 paragraph
 *
 * @param editor 编辑器实例
 * @param currentEntry 光标所在的一级节点 Entry
 * @returns 一个布尔值, 为真说明不需要执行默认行为
 *
 */
export const listDeleteBackward = (editor: Editor, currentEntry: NodeEntry): boolean => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [node, path] = currentEntry

  if (SlateElement.isElement(node) && (node.type === "ordered-list" || node.type === "unordered-list")) {
    // 判断是否到达列表的首个 Point
    if (SlateRange.isCollapsed(selection) && Editor.isStart(editor, selection.anchor, path)) {
      // 触发 deleteBackward 相当于将当前列表变为同级别的 paragraph
      Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
        at: path,
      })
      Transforms.setNodes(
        editor,
        {
          type: "paragraph",
        },
        {
          at: path,
        }
      )

      return true
    }
  }

  return false
}
