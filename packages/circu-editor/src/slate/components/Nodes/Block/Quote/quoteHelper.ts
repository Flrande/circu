import { Editor, NodeEntry, Path, Transforms } from "slate"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateNode } from "../../../../types/slate"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IQuote } from "./types"

export const isQuoteActive = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedQuotes = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "quote",
      mode: "lowest",
    })
  ) as NodeEntry<IQuote>[]
  const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
    except: ["quote"],
  })

  // 若选区内所有非引用的块级节点都在选区的引用内, 返回真
  return selectedBlocks.every(([, blockPath]) =>
    selectedQuotes.some(([, quotePath]) => Path.isAncestor(quotePath, blockPath))
  )
}

const unToggleQuote = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
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

    // 将互为兄弟的引用块分为一组
    let goalQuotesIndex: number[] = []
    let tmpIndex = 0
    while (true) {
      goalQuotesIndex.push(tmpIndex)
      tmpIndex = selectedQuotes.findIndex(
        ([, path], index) => index > tmpIndex && !Path.isSibling(path, selectedQuotes[tmpIndex][1])
      )
      if (tmpIndex === -1) {
        break
      }
    }

    if (goalQuotesIndex.length === 0) {
      return
    }

    for (const [i, quoteIndex] of goalQuotesIndex.entries()) {
      const [, goalQuotePath] = selectedQuotes[quoteIndex]

      // 当前循环要处理的引用块
      const tmpQuotes =
        i === goalQuotesIndex.length - 1
          ? selectedQuotes.slice(quoteIndex)
          : selectedQuotes.slice(quoteIndex, goalQuotesIndex[i + 1])

      const newNodes: Exclude<BlockElementExceptTextLine, IQuote>[] = tmpQuotes.flatMap(
        ([node]) => node.children[0].children
      )

      Transforms.removeNodes(editor, {
        at: Path.parent(goalQuotePath),
        match: (n, p) => tmpQuotes.some(([, path]) => Path.equals(p, path)),
        mode: "highest",
      })
      Transforms.insertNodes(editor, newNodes, {
        at: goalQuotePath,
        // 用于在之后调整选区时得到最末块级节点的位置
        select: true,
      })
    }

    const firstPath = selectedQuotes[goalQuotesIndex[0]][1]
    if (editor.selection) {
      Transforms.select(editor, Editor.range(editor, firstPath, editor.selection.focus.path))
    }
  })
}

export const toggleQuote = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (isQuoteActive(editor)) {
      unToggleQuote(editor)
    } else {
      const selectedQuotes = Array.from(
        Editor.nodes(editor, {
          match: (n) => SlateElement.isElement(n) && n.type === "quote",
        })
      ) as NodeEntry<IQuote>[]
      let selectedBlocks = getSelectedBlocks(editor)

      // 找到第一个不在引用内的块级节点
      const firstBlockNotQuoteIndex = selectedBlocks.findIndex(
        ([, blockPath]) => !selectedQuotes.some(([, quotePath]) => Path.isAncestor(quotePath, blockPath))
      )

      if (firstBlockNotQuoteIndex === -1) {
        return
      }
      selectedBlocks = selectedBlocks.slice(firstBlockNotQuoteIndex)

      if (selectedBlocks.length === 0) {
        return
      }

      let goalBlocks: NodeEntry<BlockElementExceptTextLine>[] = []
      let tmpIndex = 0
      while (true) {
        goalBlocks.push(selectedBlocks[tmpIndex])
        tmpIndex = selectedBlocks.findIndex(
          ([, path], index) => index > tmpIndex && !Path.isCommon(selectedBlocks[tmpIndex][1], path)
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

      // goalBlocks 中的引用块
      const tmpQuotes: IQuote[] = goalBlocks.flatMap(
        ([node]) =>
          Array.from(SlateNode.nodes(node))
            .filter(([node]) => SlateElement.isElement(node) && node.type === "quote")
            .map(([node]) => node) as IQuote[]
      )

      const newNode: IQuote = {
        type: "quote",
        children: [
          {
            type: "__block-element-content",
            // 这里的类型断言是为了通过类型检查, goalBlocks 实际上有引用块, 后续会删去
            children: (goalBlocks as NodeEntry<Exclude<BlockElementExceptTextLine, IQuote>>[]).map(([node]) => node),
          },
        ],
      }
      Transforms.insertNodes(editor, [newNode, ...tmpQuotes], {
        at: firstNodePath,
      })
      Transforms.removeNodes(editor, {
        at: firstNodePath,
        match: (n, p) => Path.isAncestor(firstNodePath, p) && SlateElement.isElement(n) && n.type === "quote",
      })
      Transforms.removeNodes(editor, {
        at: firstNodePath,
        match: (n, p) =>
          Path.isAncestor(firstNodePath, p) &&
          SlateElement.isElement(n) &&
          n.type === "__block-element-children" &&
          n.children.length === 0,
      })

      Transforms.select(editor, firstNodePath)
    }
  })
}
