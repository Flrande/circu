import { Editor, Element as SlateElement, Range, Transforms } from "slate"
import type { InlineCodeElement } from "../../../types/interface"

export const isInlineCodeActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "inlineCode",
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
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "inlineCode",
  })
  Transforms.splitNodes(editor, {
    at: selectEndRef.current!,
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "inlineCode",
  })

  // 用于 unwrap 后焦点在 code element 外
  const unhangSelectRef = Editor.rangeRef(
    editor,
    Editor.unhangRange(editor, {
      anchor: selectStartRef.current!,
      focus: selectEndRef.current!,
    })
  )

  Transforms.unwrapNodes(editor, {
    at: unhangSelectRef.current!,
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "inlineCode",
  })

  // 使 unwrap 后焦点在 code element 外
  Transforms.select(editor, {
    anchor: unhangSelectRef.current!.focus,
    focus: unhangSelectRef.current!.focus,
  })

  unhangSelectRef.unref()
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

  const newElement: InlineCodeElement = {
    type: "inlineCode",
    children: [],
  }
  Transforms.wrapNodes(editor, newElement, { split: true })

  Transforms.collapse(editor, { edge: "end" })
  Transforms.move(editor, { unit: "offset" })
}
