import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IQuote } from "./types"

export const isQuoteActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
      mode: "highest",
    })
  ) as NodeEntry<BlockElementExceptTextLine>[]

  return selectedContentBlocksEntry.every(([node]) => node.type === "quote")
}

const unToggleQuote = (editor: Editor) => {
  if (!editor.selection) {
    console.error("untoggleQuote() need editor.selection.")
    return
  }

  if (!isQuoteActive(editor)) {
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

  const startPath = selectedContentBlocksEntry[0][1]
  let tmpLength = 0

  for (const [node, path] of selectedContentBlocksEntry) {
    tmpLength += node.children[0].children.length

    Transforms.removeNodes(editor, {
      at: path,
    })
    Transforms.insertNodes(editor, node.children[0].children, {
      at: path,
    })
  }

  Transforms.select(
    editor,
    Editor.range(editor, startPath, startPath.slice(0, -1).concat([startPath.at(-1)! + tmpLength - 1]))
  )
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
        match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
        mode: "highest",
      })
    ) as NodeEntry<BlockElementExceptTextLine>[]

    if (selectedContentBlocksEntry.length < 1) {
      return
    }

    const blocksWithoutQuote = selectedContentBlocksEntry.filter(([node]) => node.type !== "quote") as NodeEntry<
      Exclude<BlockElementExceptTextLine, IQuote>
    >[]
    const startPath = blocksWithoutQuote[0][1]

    Transforms.removeNodes(editor, {
      match: (_, p) => blocksWithoutQuote.map(([, p]) => p).some((tp) => Path.equals(p, tp)),
    })
    const newNode: IQuote = {
      type: "quote",
      children: [
        {
          type: "__block-element-content",
          children: blocksWithoutQuote.map(([node]) => node),
        },
      ],
    }
    Transforms.insertNodes(editor, newNode, {
      at: startPath,
    })

    Transforms.select(editor, Editor.range(editor, Editor.start(editor, startPath), Editor.end(editor, startPath)))
  }
}
