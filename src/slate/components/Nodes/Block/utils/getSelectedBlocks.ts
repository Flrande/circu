import { Editor, NodeEntry } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"

export const getSelectedBlocks = (editor: Editor): Array<NodeEntry<BlockElementExceptTextLine>> | null => {
  const { selection } = editor
  if (!selection) {
    return null
  }

  // 选区开头处最深的一个 block
  const firstBlockEntry = Array.from(
    Editor.nodes(editor, {
      at: Editor.start(editor, selection),
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      mode: "lowest",
    })
  )[0] as NodeEntry<BlockElementExceptTextLine>

  if (!firstBlockEntry) {
    return null
  }

  const [, firstBlockPath] = firstBlockEntry

  const targetBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
        p.length <= firstBlockPath.length,
      mode: "lowest",
    })
  ) as NodeEntry<BlockElementExceptTextLine>[]

  if (targetBlocksEntry.length < 1) {
    return null
  }

  return targetBlocksEntry
}
