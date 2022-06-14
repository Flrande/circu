import { Editor, NodeEntry, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IOrderedList, IUnorderedList } from "./types"

export const isListActive = (editor: Editor, listType: IOrderedList["type"] | IUnorderedList["type"]): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<BlockElementExceptTextLine>[]

  return selectedContentBlocksEntry.every(([node]) => node.type === listType)
}

const unToggleList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (!isListActive(editor, "ordered-list") && !isListActive(editor, "unordered-list")) {
      return
    }

    const selectedContentBlocksEntry = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && (n.type === "ordered-list" || n.type === "unordered-list"),
      })
    ) as NodeEntry<IOrderedList | IUnorderedList>[]

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

export const toggleOrderedList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (isListActive(editor, "ordered-list")) {
      unToggleList(editor)
    } else {
      const selectedContentBlocksEntry = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type),
          //TODO: 寻找更好的匹配规则
          mode: "lowest",
        })
      ) as NodeEntry<BlockElementExceptTextLine>[]

      if (selectedContentBlocksEntry.length < 1) {
        return
      }

      const startPath = selectedContentBlocksEntry[0][1]
      const endPath = selectedContentBlocksEntry.at(-1)![1]

      for (const [index, [, path]] of selectedContentBlocksEntry.entries()) {
        Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
          at: path,
        })
        Transforms.setNodes(
          editor,
          {
            type: "ordered-list",
            indexState: {
              type: index === 0 ? "head" : "selfIncrement",
              index: 1,
            },
          },
          {
            at: path,
          }
        )
      }

      Transforms.select(editor, Editor.range(editor, startPath, endPath))
    }
  })
}

export const toggleUnorderedList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (isListActive(editor, "unordered-list")) {
      unToggleList(editor)
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
            type: "unordered-list",
          },
          {
            at: path,
          }
        )
      }

      Transforms.select(editor, Editor.range(editor, startPath, endPath))
    }
  })
}
