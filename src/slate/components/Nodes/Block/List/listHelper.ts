import { Editor, NodeEntry, Transforms } from "slate"
import {
  BLOCK_ELEMENTS_WITHOUT_TEXT_LINE,
  BLOCK_ELEMENTS_WITH_CONTENT,
  CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN,
} from "../../../../types/constant"
import type { BlockElementWithContent, BlockElementWithoutTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IParagraph } from "../Paragraph/types"
import type { IOrderedList, IUnorderedList } from "./types"

export const isListActive = (editor: Editor, listType: IOrderedList["type"] | IUnorderedList["type"]) => {
  const { selection } = editor
  if (!selection) return false

  const selectedContentBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
    })
  ) as NodeEntry<BlockElementWithoutTextLine>[]

  return selectedContentBlocksEntry.every(([node]) => node.type === listType)
}

const unToggleList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("unToggleList() need editor.selection.")
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
}

export const toggleOrderedList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleOrderedList() need editor.selection.")
    return
  }

  if (isListActive(editor, "ordered-list")) {
    unToggleList(editor)
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
          type: "ordered-list",
          indexState: {
            type: "head",
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
}

export const toggleUnorderedList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleUnorderedList() need editor.selection.")
    return
  }

  if (isListActive(editor, "unordered-list")) {
    unToggleList(editor)
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
          type: "unordered-list",
        },
        {
          at: path,
        }
      )
    }

    Transforms.select(editor, Editor.range(editor, startPath, endPath))
  }
}
