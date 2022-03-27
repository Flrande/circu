import { Editor, Transforms } from "slate"
import type { BlockCodeType } from "../components/Nodes/Block/BlockCode/types"
import { SlateElement } from "../types/slate"

const verifyBlockCodeChild = (node: BlockCodeType) => {
  const children = node.children
  return (
    children.length === 3 &&
    children[0].type === "blockCode_voidArea" &&
    children[0].children.length === 1 &&
    children[0].children[0].text === "" &&
    children[1].type === "blockCode_codeArea" &&
    children[2].type === "blockCode_voidArea" &&
    children[2].children.length === 1 &&
    children[2].children[0].text === ""
  )
}

const withNormalizeForBlockCode = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    const [currentNode, currentPath] = entry
    normalizeNode(entry)

    if (SlateElement.isElement(currentNode) && currentNode.type === "blockCode") {
      if (verifyBlockCodeChild(currentNode)) {
        return
      } else {
        // 若不符合 blockCode 的内建约束, 删除该代码块
        Transforms.removeNodes(editor, {
          at: currentPath,
        })
      }
    }
  }

  return editor
}

export const withNormalize = (editor: Editor) => {
  return withNormalizeForBlockCode(editor)
}
