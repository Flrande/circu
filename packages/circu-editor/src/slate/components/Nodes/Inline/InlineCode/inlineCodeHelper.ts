import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { IInlineCode } from "./types"

export const isInlineCodeActive = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "inline-code",
    })
  )
  return match.length > 0 ? true : false
}

const unToggleInlineCode = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (!isInlineCodeActive(editor)) {
      return
    }

    const [selectStart, selectEnd] = Editor.edges(editor, selection)
    const selectStartRef = Editor.pointRef(editor, selectStart)
    const selectEndRef = Editor.pointRef(editor, selectEnd)

    // 在两个 point 上分割该 inline element
    Transforms.splitNodes(editor, {
      at: selectStartRef.current!,
      match: (n) => SlateElement.isElement(n) && n.type === "inline-code",
    })
    Transforms.splitNodes(editor, {
      at: selectEndRef.current!,
      match: (n) => SlateElement.isElement(n) && n.type === "inline-code",
    })

    const unToggleRangeRef = Editor.rangeRef(
      editor,
      Editor.unhangRange(editor, {
        anchor: selectStartRef.current!,
        focus: selectEndRef.current!,
      })
    )

    Transforms.unwrapNodes(editor, {
      at: unToggleRangeRef.current!,
      match: (n) => SlateElement.isElement(n) && n.type === "inline-code",
    })

    Transforms.select(editor, Editor.unhangRange(editor, unToggleRangeRef.current!))

    unToggleRangeRef.unref()
    selectStartRef.unref()
    selectEndRef.unref()
  })
}

export const toggleInlineCode = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (isInlineCodeActive(editor)) {
      unToggleInlineCode(editor)
      return
    }

    const { selection } = editor
    if (!selection) {
      return
    }

    if (SlateRange.isCollapsed(selection)) {
      return
    }

    const [selectStart, selectEnd] = Editor.edges(editor, selection)
    const unToggleRangeRef = Editor.rangeRef(
      editor,
      Editor.unhangRange(editor, {
        anchor: selectStart,
        focus: selectEnd,
      })
    )

    const newElement: IInlineCode = {
      type: "inline-code",
      children: [],
    }
    Transforms.wrapNodes(editor, newElement, { split: true })

    // 恢复 selection, 注意需要 unhangRange
    Transforms.select(editor, Editor.unhangRange(editor, unToggleRangeRef.current!))
    unToggleRangeRef.unref()
  })
}
