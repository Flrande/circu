import { Editor, NodeEntry, Path, Transforms } from "slate"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IQuote } from "./types"

//TODO: 优化选区
export const isQuoteActive = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedQuotes = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "quote",
      mode: "lowest",
    })
  ) as NodeEntry<IQuote>[]

  return selectedQuotes.length !== 0
}

const unToggleQuote = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (!isQuoteActive(editor)) {
      return
    }

    const selectedQuotes = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "quote",
        mode: "lowest",
      })
    ) as NodeEntry<IQuote>[]

    if (selectedQuotes.length === 0) {
      return
    }

    const [goalQuote, goalQuotePath] = selectedQuotes[0]

    const newNodes: Exclude<BlockElementExceptTextLine, IQuote>[] = goalQuote.children[0].children
    Transforms.removeNodes(editor, {
      at: goalQuotePath,
    })
    Transforms.insertNodes(editor, newNodes, {
      at: goalQuotePath,
    })
  })
}

export const toggleQuote = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    if (!editor.selection) {
      return
    }

    if (isQuoteActive(editor)) {
      unToggleQuote(editor)
    } else {
      const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
        except: ["quote"],
      })

      if (selectedBlocks.length === 0) {
        return
      }

      let goalBlocks: NodeEntry<Exclude<BlockElementExceptTextLine, IQuote>>[] = []
      let tmpIndex = 0
      while (true) {
        goalBlocks.push(selectedBlocks[tmpIndex])
        tmpIndex = selectedBlocks.findIndex(
          ([, path], index) => index >= tmpIndex && !Path.isCommon(selectedBlocks[tmpIndex][1], path)
        )
        if (tmpIndex === -1) {
          break
        }
      }

      if (goalBlocks.length === 0) {
        return
      }

      const [, firstNodePath] = goalBlocks[0]
      Transforms.removeNodes(editor, {
        match: (n, p) => goalBlocks.some(([, path]) => Path.equals(path, p)),
      })

      const newNode: IQuote = {
        type: "quote",
        children: [
          {
            type: "__block-element-content",
            children: goalBlocks.map(([node]) => node),
          },
        ],
      }
      Transforms.insertNodes(editor, newNode, {
        at: firstNodePath,
      })
    }
  })
}
