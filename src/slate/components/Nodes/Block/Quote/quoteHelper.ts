import { Editor, NodeEntry, Transforms } from "slate"
import { INDENT_TYPE_ELEMENTS, PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { IndentTypeElement, ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { splitBlockCode } from "../BlockCode/splitBlockCode"
import { splitQuote } from "./splitQuote"
import type { IQuote, IQuote_Line, IQuote_LineIndentLevel } from "./types"

export const isQuoteActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "quote",
    })
  )

  return match.length > 0 ? true : false
}

const unToggleQuote = (editor: Editor) => {
  if (!editor.selection) {
    console.error("untoggleQuote() need editor.selection.")
    return
  }

  splitQuote(editor, editor.selection)
}

export const toggleQuote = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleQuote() need editor.selection.")
    return
  }

  const tmpEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        (arrayIncludes(
          PARAGRAPH_TYPE_ELEMENTS.filter((item) => item !== "quote_line"),
          n.type
        ) ||
          n.type === "quote"),
    })
  ) as Array<NodeEntry<Exclude<ParagraphTypeElement, IQuote_Line> | IQuote>>

  if (tmpEntryArr.every(([node]) => node.type === "quote") && tmpEntryArr.length === 1) {
    unToggleQuote(editor)
  } else {
    const newNode: IQuote = {
      type: "quote",
      children: tmpEntryArr.flatMap(([node]) => {
        if (node.type === "quote") {
          return node.children
        }

        let level: IQuote_LineIndentLevel = 0
        if (
          arrayIncludes(
            INDENT_TYPE_ELEMENTS.filter((item) => item !== "quote_line") as Array<
              Exclude<IndentTypeElement["type"], "quote_line">
            >,
            node.type
          )
        ) {
          const tmpNode = node as Exclude<IndentTypeElement, IQuote_Line>
          if (tmpNode.indentLevel >= 0 && tmpNode.indentLevel <= 16) {
            level = tmpNode.indentLevel as IQuote_LineIndentLevel
          }
        }

        const item: IQuote_Line = {
          type: "quote_line",
          indentLevel: level,
          children: node.children,
        }
        return item
      }),
    }

    // 选区在代码块内, 先将 codeLine 分离出来
    if (tmpEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
      // splitBlockCode 执行完成后 editor.selection 仍为对应选区
      splitBlockCode(editor, editor.selection)
    }

    const path = SlateRange.start(editor.selection).path.slice(0, 1)

    Transforms.removeNodes(editor, {
      at: editor.selection,
      mode: "highest",
    })
    Transforms.insertNodes(editor, newNode, {
      at: path,
    })

    const newRange: SlateRange = {
      anchor: Editor.start(editor, path),
      focus: Editor.end(editor, path),
    }
    Transforms.select(editor, newRange)
  }
}
