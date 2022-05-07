import { Editor, NodeEntry, Transforms } from "slate"
import { INDENT_TYPE_ELEMENTS, PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { IndentTypeElement, ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { spiltBlockCode } from "../BlockCode/spiltBlockCode"
import type { IHead, IHeadGrade, IHeadIndentLevel } from "./types"

export const toggleHead = (editor: Editor, headGrade: IHeadGrade) => {
  if (!editor.selection) {
    console.error("toggleHead() need editor.selection.")
    return
  }

  const selectedParagraphTypeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as Array<NodeEntry<ParagraphTypeElement>>

  const newNodes: IHead[] = selectedParagraphTypeEntryArr.map(([node]) => {
    let level: IHeadIndentLevel = 0
    if (arrayIncludes(INDENT_TYPE_ELEMENTS, node.type)) {
      const tmpNode = node as IndentTypeElement
      if (tmpNode.indentLevel >= 0 && tmpNode.indentLevel <= 16) {
        level = tmpNode.indentLevel as IHeadIndentLevel
      }
    }

    const head: IHead = {
      type: "head",
      indentLevel: level,
      headGrade,
      children: node.children,
    }
    return head
  })

  // 选区在代码块内, 先将 codeLine 分离出来
  if (selectedParagraphTypeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
    // spiltBlockCode 执行完成后 editor.selection 仍为对应选区
    spiltBlockCode(editor, editor.selection)
  }

  const firstPath = SlateRange.start(editor.selection).path.slice(0, 1)
  const lastPath = [firstPath[0] + newNodes.length - 1]

  Transforms.removeNodes(editor, {
    at: editor.selection,
  })
  Transforms.insertNodes(editor, newNodes, {
    at: firstPath,
  })

  Transforms.select(editor, Editor.end(editor, lastPath))
}
