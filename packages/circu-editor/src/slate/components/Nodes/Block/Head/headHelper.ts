import { Editor, NodeEntry, Path, Transforms } from "slate"
import { CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { unToggleFold } from "../../../FoldButton/foldHelper"
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
      // 先取消折叠
      unToggleFold(editor, path)

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

      // 如果当前标题前最近的同深度标题为折叠状态, 取消其折叠
      const previousHeads = Array.from(
        Editor.nodes(editor, {
          at: Path.parent(path),
          match: (n, p) => SlateElement.isElement(n) && n.type === "head" && Path.isSibling(path, p),
        })
      ) as NodeEntry<IHead>[]
      if (previousHeads.length > 0 && previousHeads.at(-1)![0].isFolded) {
        unToggleFold(editor, previousHeads.at(-1)![1])
      }
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
        // 先取消折叠
        unToggleFold(editor, path)

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

        // 如果当前标题前最近的同深度标题为折叠状态, 且新的标题级别低于其级别, 取消其折叠
        const previousHeads = Array.from(
          Editor.nodes(editor, {
            at: Path.parent(path),
            match: (n, p) => SlateElement.isElement(n) && n.type === "head" && Path.isSibling(path, p),
          })
        ) as NodeEntry<IHead>[]
        if (
          previousHeads.length > 0 &&
          previousHeads.at(-1)![0].isFolded &&
          parseInt(headGrade) > parseInt(previousHeads.at(-1)![0].headGrade)
        ) {
          unToggleFold(editor, previousHeads.at(-1)![1])
        }
      }
    }
  })
}
