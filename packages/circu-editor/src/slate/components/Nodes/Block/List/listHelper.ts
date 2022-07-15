import { Editor, NodeEntry, Path, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
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
    const { selection } = editor
    if (!selection) {
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

      for (const [, path] of selectedBlocks) {
        // 决定当前块级节点转化为有序列表后是否为列表头
        let currentBlockFlag = true

        // 如果当前块级节点相邻前有同深度有序列表, 其转化为有序列表后类型应为自增
        try {
          const previousBlock = Editor.node(editor, Path.previous(path))
          if (SlateElement.isElement(previousBlock[0]) && previousBlock[0].type === "ordered-list") {
            currentBlockFlag = false
          }
        } catch (error) {}

        // 如果当前块级节点相邻后有同深度有序列表, 相邻后同深度有序列表类型应为自增
        try {
          const nextBlock = Editor.node(editor, Path.next(path))
          if (SlateElement.isElement(nextBlock[0]) && nextBlock[0].type === "ordered-list") {
            const [list, listPath] = nextBlock
            if (list.indexState.type !== "selfIncrement") {
              Transforms.setNodes(
                editor,
                {
                  indexState: {
                    type: "selfIncrement",
                    index: list.indexState.index,
                  },
                },
                {
                  at: listPath,
                }
              )
            }
          }
        } catch (error) {}

        Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
          at: path,
        })
        Transforms.setNodes(
          editor,
          {
            type: "ordered-list",
            indexState: {
              type: currentBlockFlag ? "head" : "selfIncrement",
              index: 1,
            },
          },
          {
            at: path,
          }
        )
      }
    }
  })
}

export const toggleUnorderedList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
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
    }
  })
}
