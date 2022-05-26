import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { IParagraph } from "../Paragraph/types"
import type { IBlockCode, IBlockCode_CodeLine } from "./types"

/**
 * 用于分割代码块的函数, 仅作用于一个代码块,
 * 执行完成后 editor.selection 为 range 对应选区
 *
 * @param editor 对应编辑器实例
 * @param range 要分割出的范围
 *
 */
export const splitBlockCode = (editor: Editor, range: SlateRange) => {
  const blockCodeEntryArr = Array.from(
    Editor.nodes(editor, {
      at: range,
      match: (n) => SlateElement.isElement(n) && n.type === "blockCode",
    })
  ) as NodeEntry<IBlockCode>[]

  // 判断是否只相关一个代码块
  if (blockCodeEntryArr.length > 1) {
    console.error("splitBlockCode() just work for one blockCode.")
    return
  }

  const [blockCodeNode, blockCodePath] = blockCodeEntryArr[0]
  const blockCodeRange: SlateRange = {
    anchor: Editor.start(editor, blockCodePath),
    focus: Editor.end(editor, blockCodePath),
  }

  // 判断 range 是否在代码块内
  // SlateRange.includes(range_1, range_2) 相当于检查两个 range 有没有交叉部分
  // 故此处不能直接这样用
  if (!(SlateRange.includes(blockCodeRange, range.anchor) && SlateRange.includes(blockCodeRange, range.focus))) {
    console.error("splitBlockCode() just work for range included blockCode.")
    return
  }

  // 选中的 codeLine
  const codeLineEntryArr = Array.from(
    Editor.nodes(editor, {
      at: range,
      match: (n) => SlateElement.isElement(n) && n.type === "blockCode_codeLine",
    })
  ) as NodeEntry<IBlockCode_CodeLine>[]

  // 根据选中 codeLine 生产的 paragraph
  const newParagraphNodes: IParagraph[] = codeLineEntryArr.map(([node]) => {
    const newNode: IParagraph = {
      type: "paragraph",
      indentLevel: 0,
      children: node.children,
    }
    return newNode
  })
  const voidArea = blockCodeNode.children[0]
  const codeArea = blockCodeNode.children[1]
  const firstCodeLineIndex = codeLineEntryArr[0][1].slice(-1)[0]
  const lastCodeLineIndex = codeLineEntryArr.slice(-1)[0][1].slice(-1)[0]

  // 拆分后 -> startBlockCode - newParagraph - lastBlockCode
  // 关于 Object.assign({}, voidArea) -> https://github.com/ianstormtaylor/slate/issues/4309
  const startBlockCode: IBlockCode = {
    type: "blockCode",
    children: [
      voidArea,
      {
        type: "blockCode_codeArea",
        langKey: codeArea.langKey,
        children: codeArea.children.slice(0, firstCodeLineIndex),
      },
      Object.assign({}, voidArea),
    ],
  }
  const lastBlockCode: IBlockCode = {
    type: "blockCode",
    children: [
      voidArea,
      {
        type: "blockCode_codeArea",
        langKey: codeArea.langKey,
        children: codeArea.children.slice(lastCodeLineIndex + 1),
      },
      Object.assign({}, voidArea),
    ],
  }

  const newNodes: (IBlockCode | IParagraph)[] = [...newParagraphNodes]
  if (firstCodeLineIndex !== 0) {
    newNodes.unshift(startBlockCode)
  }
  if (lastCodeLineIndex !== codeArea.children.length - 1) {
    newNodes.push(lastBlockCode)
  }

  Transforms.removeNodes(editor, {
    at: blockCodePath,
  })
  Transforms.insertNodes(editor, newNodes, {
    at: blockCodePath,
  })

  const firstPath =
    firstCodeLineIndex !== 0 ? blockCodePath.slice(0, -1).concat([blockCodePath.slice(-1)[0] + 1]) : blockCodePath
  const lastPath =
    firstCodeLineIndex !== 0
      ? blockCodePath.slice(0, -1).concat([blockCodePath.slice(-1)[0] + newParagraphNodes.length])
      : blockCodePath.slice(0, -1).concat([blockCodePath.slice(-1)[0] + newParagraphNodes.length - 1])
  const newRange = Editor.range(editor, firstPath, lastPath)

  Transforms.select(editor, newRange)
}
