import { Editor, Range, Transforms } from "slate"
import { SlateElement } from "../../../../types/slate"
import type { InlineCodeType } from "./types"

export const isInlineCodeActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "inlineCode",
    })
  )
  return match.length > 0 ? true : false
}

export const untoggleInlineCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("untoggleInlineCode() need editor.selection.")
    return
  }

  if (!isInlineCodeActive(editor)) {
    console.error("untoggleInlineCode() should not called when inline code active.")
    return
  }

  const [selectStart, selectEnd] = Editor.edges(editor, editor.selection)
  const selectStartRef = Editor.pointRef(editor, selectStart)
  const selectEndRef = Editor.pointRef(editor, selectEnd)

  // 在两个 point 上分割该 inline element
  Transforms.splitNodes(editor, {
    at: selectStartRef.current!,
    match: (n) => SlateElement.isElement(n) && n.type === "inlineCode",
  })
  Transforms.splitNodes(editor, {
    at: selectEndRef.current!,
    match: (n) => SlateElement.isElement(n) && n.type === "inlineCode",
  })

  const untoggleRangeRef = Editor.rangeRef(
    editor,
    Editor.unhangRange(editor, {
      anchor: selectStartRef.current!,
      focus: selectEndRef.current!,
    })
  )

  Transforms.unwrapNodes(editor, {
    at: untoggleRangeRef.current!,
    match: (n) => SlateElement.isElement(n) && n.type === "inlineCode",
  })

  Transforms.select(editor, Editor.unhangRange(editor, untoggleRangeRef.current!))

  untoggleRangeRef.unref()
  selectStartRef.unref()
  selectEndRef.unref()
}

export const toggleInlineCode = (editor: Editor) => {
  if (isInlineCodeActive(editor)) {
    untoggleInlineCode(editor)
    return
  }

  if (!editor.selection) {
    console.error("toggleInlineCode() need editor.selection.")
    return
  }

  if (Range.isCollapsed(editor.selection)) {
    console.error("toggleInlineCode() should not called with collapsed editor.selection.")
    return
  }

  const [selectStart, selectEnd] = Editor.edges(editor, editor.selection)
  const untoggleRangeRef = Editor.rangeRef(
    editor,
    Editor.unhangRange(editor, {
      anchor: selectStart,
      focus: selectEnd,
    })
  )

  const newElement: InlineCodeType = {
    type: "inlineCode",
    children: [],
  }
  Transforms.wrapNodes(editor, newElement, { split: true })

  // 恢复 selection, 注意需要 unhangRange
  Transforms.select(editor, Editor.unhangRange(editor, untoggleRangeRef.current!))
  untoggleRangeRef.unref()
}
