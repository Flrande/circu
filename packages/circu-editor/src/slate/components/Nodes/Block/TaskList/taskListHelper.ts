import { Editor, NodeEntry, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import type { IQuote } from "../Quote/types"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { ITaskList } from "./types"

export const isTaskListActive = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
    except: ["quote"],
  })

  return selectedBlocks.every(([node]) => node.type === "task-list")
}

export const unToggleTaskList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (!isTaskListActive(editor)) {
      return
    }

    const selectedLists = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
      except: ["quote"],
    }).filter(([node]) => node.type !== "task-list") as NodeEntry<ITaskList>[]

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

export const toggleTaskList = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (isTaskListActive(editor)) {
      unToggleTaskList(editor)
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
            type: "task-list",
          },
          {
            at: path,
          }
        )
      }
    }
  })
}
