import { Editor, NodeEntry } from "slate"
import { normalizeBlockCode } from "../components/Nodes/Block/BlockCode/normalizeBlockCode"
import type { IBlockCode } from "../components/Nodes/Block/BlockCode/types"
import { normalizeOrderedList } from "../components/Nodes/Block/List/normalizeList"
import { SlateElement } from "../types/slate"

const withNormalizeForBlockCode = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    const [currentNode] = entry

    if (Editor.isEditor(currentNode)) {
      normalizeOrderedList(editor)
      return
    }

    if (SlateElement.isElement(currentNode) && currentNode.type === "blockCode") {
      normalizeBlockCode(editor, entry as NodeEntry<IBlockCode>)
      return
    }

    normalizeNode(entry)
  }

  return editor
}

export const withNormalize = (editor: Editor) => {
  return withNormalizeForBlockCode(editor)
}
