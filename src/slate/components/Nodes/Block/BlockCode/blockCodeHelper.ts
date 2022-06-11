import { Editor, NodeEntry, Transforms } from "slate"
import {
  BLOCK_ELEMENTS_WITHOUT_TEXT_LINE,
  BLOCK_ELEMENTS_WITH_CONTENT,
  CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN,
} from "../../../../types/constant"
import type { BlockElementWithContent, BlockElementWithoutTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IBlockCode } from "./types"

export const isBlockCodeActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<BlockElementWithoutTextLine>[]

  return selectedContentBlocksEntry.every(([node]) => node.type === "block-code")
}

const unToggleBlockCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("unToggleBlockCode() need editor.selection.")
    return
  }

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "block-code",
    })
  ) as NodeEntry<IBlockCode>[]

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

export const toggleBlockCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleBlockCode() need editor.selection.")
    return
  }

  if (isBlockCodeActive(editor)) {
    unToggleBlockCode(editor)
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

    for (const [, path] of selectedContentBlocksEntry) {
      Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
        at: path,
      })
      Transforms.setNodes(
        editor,
        {
          type: "block-code",
          langKey: "PlainText",
        },
        {
          at: path,
        }
      )
    }

    Transforms.select(editor, Editor.range(editor, startPath, endPath))
  }
}
