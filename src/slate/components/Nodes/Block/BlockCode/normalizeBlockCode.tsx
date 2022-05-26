import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { IBlockCode } from "./types"

const verifyBlockCodeChild = (node: IBlockCode) => {
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

/**
 * 用于规格化代码块的函数, 保证 blockCode 内遵循 VoidArea - CodeArea - VoidArea
 *
 * @param editor 当前编辑器实例
 * @param entry 当前 entry
 * @returns 一个布尔值, 若为真, 可提前结束当前规格化
 *
 */
export const normalizeBlockCode = (editor: Editor, entry: NodeEntry) => {
  const [currentNode, currentNodePath] = entry

  if (SlateElement.isElement(currentNode) && currentNode.type === "blockCode") {
    // 若不符合 blockCode 的内建约束, 删除该代码块
    if (!verifyBlockCodeChild(currentNode)) {
      Transforms.removeNodes(editor, {
        at: currentNodePath,
      })
      return true
    }
  }

  return false
}
