// import { Editor, NodeEntry, Transforms } from "slate"
// import { SlateElement, SlateRange } from "../../../../types/slate"
// import type { IParagraph } from "../Paragraph/types"
// import type { IQuote, IQuote_Line } from "./types"

// /**
//  * 用于分割引用块的函数, 仅作用于一个引用块,
//  * 执行完成后 editor.selection 为 range 对应选区
//  *
//  * @param editor 对应编辑器实例
//  * @param range 要分割出的范围
//  *
//  */
// export const splitQuote = (editor: Editor, range: SlateRange) => {
//   const quoteEntryArr = Array.from(
//     Editor.nodes(editor, {
//       at: range,
//       match: (n) => SlateElement.isElement(n) && n.type === "quote",
//     })
//   ) as NodeEntry<IQuote>[]

//   // 判断是否只相关一个引用块
//   if (quoteEntryArr.length > 1) {
//     console.error("splitQuote() just work for one quote.")
//     return
//   }

//   const [quoteNode, quotePath] = quoteEntryArr[0]
//   const quoteRange: SlateRange = {
//     anchor: Editor.start(editor, quotePath),
//     focus: Editor.end(editor, quotePath),
//   }

//   // 判断 range 是否在引用块内
//   // SlateRange.includes(range_1, range_2) 相当于检查两个 range 有没有交叉部分
//   // 故此处不能直接这样用
//   if (!(SlateRange.includes(quoteRange, range.anchor) && SlateRange.includes(quoteRange, range.focus))) {
//     console.error("spiltQuote() just work for range included quote.")
//     return
//   }

//   // 选中的 Quote_Line
//   const quoteLineEntryArr = Array.from(
//     Editor.nodes(editor, {
//       at: range,
//       match: (n) => SlateElement.isElement(n) && n.type === "quote_line",
//     })
//   ) as NodeEntry<IQuote_Line>[]

//   //TODO: 保留缩进
//   // 根据选中 Quote_Line 生产的 paragraph
//   const newParagraphNodes: IParagraph[] = quoteLineEntryArr.map(([node]) => {
//     const newNode: IParagraph = {
//       type: "paragraph",
//       indentLevel: 0,
//       children: node.children,
//     }
//     return newNode
//   })
//   const firstLineIndex = quoteLineEntryArr[0][1].at(-1)!
//   const lastLineIndex = quoteLineEntryArr.at(-1)![1].at(-1)!

//   const startquote: IQuote = {
//     type: "quote",
//     children: quoteNode.children.slice(0, firstLineIndex),
//   }
//   const lastquote: IQuote = {
//     type: "quote",
//     children: quoteNode.children.slice(lastLineIndex + 1),
//   }

//   const newNodes: (IQuote | IParagraph)[] = [...newParagraphNodes]
//   if (firstLineIndex !== 0) {
//     newNodes.unshift(startquote)
//   }
//   if (lastLineIndex !== quoteNode.children.length - 1) {
//     newNodes.push(lastquote)
//   }

//   Transforms.removeNodes(editor, {
//     at: quotePath,
//   })
//   Transforms.insertNodes(editor, newNodes, {
//     at: quotePath,
//   })

//   const firstPath = firstLineIndex !== 0 ? quotePath.slice(0, -1).concat([quotePath.at(-1)! + 1]) : quotePath
//   const lastPath =
//     firstLineIndex !== 0
//       ? quotePath.slice(0, -1).concat([quotePath.at(-1)! + newParagraphNodes.length])
//       : quotePath.slice(0, -1).concat([quotePath.at(-1)! + newParagraphNodes.length - 1])
//   const newRange = Editor.range(editor, firstPath, lastPath)

//   Transforms.select(editor, newRange)
// }

export {}
