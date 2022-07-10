import { Editor, NodeEntry, Path } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"

/**
 * 用于获得选区内除 text-line 外的块级节点的函数
 *
 * @param editor 编辑器实例
 * @param options range 为选区, 默认为 editor.selection; except 为要排除的节点类型
 * @returns 一个数组, 包含节点及节点路径
 *
 */
export const getSelectedBlocks = <T extends BlockElementExceptTextLine>(
  editor: Editor,
  options: {
    range?: SlateRange
    except?: BlockElementExceptTextLine["type"][]
  } = {}
): NodeEntry<T>[] => {
  const { range = editor.selection, except = [] } = options
  if (!range) {
    return []
  }

  const [firstBlockEntry] = Array.from(
    Editor.nodes(editor, {
      at: Editor.start(editor, range),
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      mode: "lowest",
    })
  ) as NodeEntry<BlockElementExceptTextLine>[]
  if (!firstBlockEntry) {
    return []
  }
  const firstPath = firstBlockEntry[1]

  const selectedBlocks = Array.from(
    Editor.nodes(editor, {
      at: range,
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<T>[]
  const firstBlockIndex = selectedBlocks.findIndex(([node, path]) => Path.equals(path, firstPath))

  return selectedBlocks.slice(firstBlockIndex).filter(([node]) => except.every((type) => node.type !== type))
}
