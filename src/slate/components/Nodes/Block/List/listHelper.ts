import { Editor, NodeEntry, Transforms } from "slate"
import { PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { spiltBlockCode } from "../BlockCode/blockCodeUtils"
import type { IList } from "./types"

export const isListActive = (editor: Editor, listType: IList["listType"]) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "list" && n.listType === listType,
    })
  )

  return match.length > 0 ? true : false
}

export const toggleList = (editor: Editor, listType: IList["listType"]) => {
  if (!editor.selection) {
    console.error("toggleOrderedList() need editor.selection.")
    return
  }

  const selectedParagraphTypeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as Array<NodeEntry<ParagraphTypeElement>>

  const newNodes: IList[] = selectedParagraphTypeEntryArr.map(([node]) => {
    const list: IList = {
      type: "list",
      listType,
      index: listType === "ordered" ? 1 : null,
      children: node.children,
    }
    return list
  })

  // 选区在代码块内, 先将 codeLine 分离出来
  if (selectedParagraphTypeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
    // 执行完成后 editor.selection 仍为对应选区
    spiltBlockCode(editor, editor.selection)
  }

  const firstPath = SlateRange.start(editor.selection).path.slice(0, 1)
  Transforms.removeNodes(editor, {
    at: editor.selection,
  })
  Transforms.insertNodes(editor, newNodes, {
    at: firstPath,
  })
}
