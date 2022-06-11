import { Editor, NodeEntry } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"

/**
 * 处理代码块中单字符删除相关的逻辑:
 * 1. 若到达当前代码块的首个 Point, 静默, 不删除
 *
 * @param editor 当前编辑器实例
 * @param currentEntry 光标所在的一级节点 Entry
 * @returns 一个布尔值, 为真说明不需要执行默认行为
 *
 */
export const blockCodeDeleteBackward = (editor: Editor, currentEntry: NodeEntry) => {
  const { selection } = editor
  if (!selection) {
    return false
  }

  const [node, path] = currentEntry

  if (SlateElement.isElement(node) && node.type === "block-code") {
    if (
      SlateRange.isCollapsed(selection) &&
      // 判断是否为首行首位
      Editor.isStart(editor, selection.anchor, path)
    ) {
      return true
    }
  }

  return false
}
