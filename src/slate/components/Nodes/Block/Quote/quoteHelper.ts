import { Editor, NodeEntry, Transforms } from "slate"
import { BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, BLOCK_ELEMENTS_WITH_CONTENT } from "../../../../types/constant"
import type { BlockElementWithContent, BlockElementWithoutTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IQuote } from "./types"

export const isQuoteActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<BlockElementWithoutTextLine>[]

  return selectedContentBlocksEntry.every(([node]) => node.type === "quote")
}

const unToggleQuote = (editor: Editor) => {
  if (!editor.selection) {
    console.error("untoggleQuote() need editor.selection.")
    return
  }

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "quote",
    })
  ) as NodeEntry<IQuote>[]

  if (selectedContentBlocksEntry.length < 1) {
    return
  }
}

export const toggleQuote = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleQuote() need editor.selection.")
    return
  }

  if (isQuoteActive(editor)) {
    unToggleQuote(editor)
  } else {
    const selectedContentBlocksEntry = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITH_CONTENT, n.type),
      })
    ) as NodeEntry<BlockElementWithContent>[]

    if (selectedContentBlocksEntry.length < 1) {
      return
    }

    const startPath = selectedContentBlocksEntry[0][1]
    const endPath = selectedContentBlocksEntry.at(-1)![1]

    Transforms.removeNodes(editor, {
      mode: "highest",
    })
    const newNode: IQuote = {
      type: "quote",
      children: [
        {
          type: "__block-element-children",
          children: selectedContentBlocksEntry.map(([node]) => node),
        },
      ],
    }
    Transforms.insertNodes(editor, newNode, {
      at: startPath,
    })

    Transforms.select(editor, Editor.range(editor, startPath, endPath))
  }
}
