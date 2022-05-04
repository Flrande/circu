import { Editor, NodeEntry, Transforms } from "slate"
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
 * 用于规格化代码块的函数, 保证 blockCode 内遵循
 * VoidArea - CodeArea - VoidArea
 *
 * @param editor 当前编辑器实例
 * @param blockCodeEntry 要处理的代码块的 entry
 *
 */
export const normalizeBlockCode = (editor: Editor, blockCodeEntry: NodeEntry<IBlockCode>) => {
  const [blockCode, blockCodePath] = blockCodeEntry

  // 若不符合 blockCode 的内建约束, 删除该代码块
  if (!verifyBlockCodeChild(blockCode)) {
    Transforms.removeNodes(editor, {
      at: blockCodePath,
    })
    return
  }
}
