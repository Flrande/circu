import { Editor, NodeEntry, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IHead, IHeadGrade } from "./types"

export const isHeadActive = (editor: Editor, headGrade: IHeadGrade | "all") => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<BlockElementExceptTextLine>[]

  return headGrade === "all"
    ? selectedContentBlocksEntry.every(([node]) => node.type === "head")
    : selectedContentBlocksEntry.every(([node]) => node.type === "head" && node.headGrade === headGrade)
}

const unToggleHead = (editor: Editor) => {
  if (!editor.selection) {
    console.error("unToggleHead() need editor.selection.")
    return
  }

  if (!isHeadActive(editor, "all")) {
    return
  }

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "head",
    })
  ) as NodeEntry<IHead>[]

  if (selectedContentBlocksEntry.length < 1) {
    return
  }

  const startPath = selectedContentBlocksEntry[0][1]
  const endPath = selectedContentBlocksEntry.at(-1)![1]

  for (const [, path] of selectedContentBlocksEntry) {
    Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
      at: path,
    })
    Transforms.setNodes(
      editor,
      {
        type: "paragraph",
      },
      {
        at: path,
      }
    )
  }

  Transforms.select(editor, Editor.range(editor, startPath, endPath))
}

export const toggleHead = (editor: Editor, headGrade: IHeadGrade) => {
  if (!editor.selection) {
    console.error("toggleHead() need editor.selection.")
    return
  }

  if (isHeadActive(editor, headGrade)) {
    unToggleHead(editor)
  } else {
    const selectedContentBlocksEntry = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      })
    ) as NodeEntry<BlockElementExceptTextLine>[]

    if (selectedContentBlocksEntry.length < 1) {
      return
    }

    const startPath = selectedContentBlocksEntry[0][1]
    const endPath = selectedContentBlocksEntry.at(-1)![1]

    for (const [, path] of selectedContentBlocksEntry) {
      Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
        at: path,
      })
      Transforms.setNodes(
        editor,
        {
          type: "head",
          headGrade,
        },
        {
          at: path,
        }
      )
    }

    Transforms.select(editor, Editor.range(editor, startPath, endPath))
  }
}
