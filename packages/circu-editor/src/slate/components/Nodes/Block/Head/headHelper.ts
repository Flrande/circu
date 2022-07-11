import { Editor, NodeEntry, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import type { IQuote } from "../Quote/types"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IHead, IHeadGrade } from "./types"

//TODO: 优化选区
export const isHeadActive = (editor: Editor, headGrade: IHeadGrade | "all"): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
    except: ["quote"],
  })

  return headGrade === "all"
    ? selectedBlocks.every(([node]) => node.type === "head")
    : selectedBlocks.every(([node]) => node.type === "head" && node.headGrade === headGrade)
}

const unToggleHead = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (!isHeadActive(editor, "all")) {
      return
    }

    const selectedHeads = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
      except: ["quote"],
    }).filter(([node]) => node.type === "head") as NodeEntry<IHead>[]

    if (selectedHeads.length === 0) {
      return
    }

    const startPath = selectedHeads[0][1]
    const endPath = selectedHeads.at(-1)![1]

    for (const [, path] of selectedHeads) {
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

export const toggleHead = (editor: Editor, headGrade: IHeadGrade): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (isHeadActive(editor, headGrade)) {
      unToggleHead(editor)
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
  })
}
