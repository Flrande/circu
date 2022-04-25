import { Editor, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { ILink } from "./types"

export const isLinkActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "link",
    })
  )
  return match.length > 0 ? true : false
}

export const unToggleLink = (editor: Editor) => {
  if (!editor.selection) {
    console.error("unToggleLink() need editor.selection.")
    return
  }

  if (!isLinkActive(editor)) {
    console.error("unToggleLink() should be called when link active.")
    return
  }

  const selectedLinkEntryArr = Array.from(
    Editor.nodes(editor, {
      at: editor.selection,
      match: (n) => SlateElement.isElement(n) && n.type === "link",
    })
  )

  const selectedLinkPathRefArr = selectedLinkEntryArr.map((entry) => {
    return Editor.pathRef(editor, entry[1])
  })
  for (const pathRef of selectedLinkPathRefArr) {
    if (pathRef.current) {
      Transforms.unwrapNodes(editor, {
        at: pathRef.current,
      })
    }
  }
}

export const toggleLink = (editor: Editor, url: string) => {
  // 若有 link 被选中, 被选中的 link 会先被恢复为 text
  if (isLinkActive(editor)) {
    unToggleLink(editor)
  }

  if (!editor.selection) {
    console.error("toggleLink() need editor.selection.")
    return
  }

  if (SlateRange.isCollapsed(editor.selection)) {
    console.error("toggleLink() should not called with collapsed editor.selection.")
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

  const newElement: ILink = {
    type: "link",
    url,
    children: [],
  }
  Transforms.wrapNodes(editor, newElement, { split: true })

  // 恢复 selection, 注意需要 unhangRange
  Transforms.select(editor, Editor.unhangRange(editor, untoggleRangeRef.current!))
  untoggleRangeRef.unref()
}
