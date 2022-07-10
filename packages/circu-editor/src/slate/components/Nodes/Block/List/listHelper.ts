import { Editor, NodeEntry, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import type { IQuote } from "../Quote/types"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IOrderedList, IUnorderedList } from "./types"

export const isListActive = (editor: Editor, listType: IOrderedList["type"] | IUnorderedList["type"]): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
    except: ["quote"],
  })

  return selectedBlocks.every(([node]) => node.type === listType)
}

const unToggleList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (!isListActive(editor, "ordered-list") && !isListActive(editor, "unordered-list")) {
      return
    }

    const selectedLists = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
      except: ["quote"],
    }).filter(([node]) => node.type === "ordered-list" || node.type === "unordered-list") as NodeEntry<
      IOrderedList | IUnorderedList
    >[]

    if (selectedLists.length === 0) {
      return
    }

    const startPath = selectedLists[0][1]
    const endPath = selectedLists.at(-1)![1]

    for (const [, path] of selectedLists) {
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
      const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
        except: ["quote"],
      })

      if (selectedBlocks.length === 0) {
        return
      }

      const startPath = selectedBlocks[0][1]
      const endPath = selectedBlocks.at(-1)![1]

      for (const [index, [, path]] of selectedBlocks.entries()) {
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
      const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
        except: ["quote"],
      })

      if (selectedBlocks.length === 0) {
        return
      }

      const startPath = selectedBlocks[0][1]
      const endPath = selectedBlocks.at(-1)![1]

      for (const [, path] of selectedBlocks) {
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
