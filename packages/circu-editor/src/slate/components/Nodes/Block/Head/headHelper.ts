import { Editor, NodeEntry, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import type { IQuote } from "../Quote/types"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IHead, IHeadGrade } from "./types"

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
    const { selection } = editor
    if (!selection) {
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
  })
}

export const toggleHead = (editor: Editor, headGrade: IHeadGrade): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
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
    }
  })
}
