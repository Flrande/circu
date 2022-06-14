import { Editor, NodeEntry, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IBlockCode } from "./types"

export const isBlockCodeActive = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<BlockElementExceptTextLine>[]

  return selectedContentBlocksEntry.every(([node]) => node.type === "block-code")
}

const unToggleBlockCode = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (!isBlockCodeActive(editor)) {
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
  })
}

export const toggleBlockCode = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (isBlockCodeActive(editor)) {
      unToggleBlockCode(editor)
    } else {
      const selectedBlocks = getSelectedBlocks(editor)
      if (!selectedBlocks) {
        return
      }

      const startPath = selectedBlocks[0][1]
      const endPath = selectedBlocks.at(-1)![1]

      for (const [node, path] of selectedBlocks) {
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

        // 直接删去子节点块
        if (node.children.length === 2) {
          Transforms.removeNodes(editor, {
            at: path.concat([1]),
          })
        }
      }

      Transforms.select(editor, Editor.range(editor, startPath, endPath))
    }
  })
}
