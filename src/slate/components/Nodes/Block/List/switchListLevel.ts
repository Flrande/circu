// import { Editor, NodeEntry, Path, Transforms } from "slate"
// import { SlateElement } from "../../../../types/slate"
// import type { IListIndentLevel, IOrderedList, IUnorderedList } from "./types"

// /**
//  * 切换列表级别的函数, 不负责覆盖默认行为
//  *
//  * @param editor 当前编辑器实例
//  * @param type 切换方向, 减少还是增加
//  *
//  */
// export const switchListLevel = (editor: Editor, type: "increase" | "decrease") => {
//   // 选中的列表
//   const selectedListEntryArr = Array.from(
//     Editor.nodes(editor, {
//       match: (n) => SlateElement.isElement(n) && (n.type === "unorderedList" || n.type === "orderedList"),
//     })
//   ) as NodeEntry<IUnorderedList | IOrderedList>[]

//   if (type === "increase") {
//     // 令每个列表的级别加一
//     for (const [node, path] of selectedListEntryArr) {
//       const newLevel = Math.floor(node.indentLevel + 1) as IListIndentLevel

//       if (newLevel >= 1 && newLevel <= 16 && node.indentLevel !== newLevel) {
//         Transforms.setNodes(
//           editor,
//           {
//             indentLevel: newLevel,
//           },
//           {
//             at: path,
//           }
//         )
//       }
//     }
//   } else {
//     // 令每个列表的级别减一
//     for (const [node, path] of selectedListEntryArr) {
//       const newLevel = Math.floor(node.indentLevel - 1) as IListIndentLevel

//       if (newLevel >= 1 && newLevel <= 16 && node.indentLevel !== newLevel) {
//         Transforms.setNodes(
//           editor,
//           {
//             indentLevel: newLevel,
//           },
//           {
//             at: path,
//           }
//         )
//       }
//     }
//   }

//   // 列表嵌套级别更新完毕后, 处理有序列表的索引
//   // 重新抓取, 拿到更新完毕的元素
//   const selectedOrderedListEntryArr = Array.from(
//     Editor.nodes(editor, {
//       match: (n) => SlateElement.isElement(n) && n.type === "orderedList",
//     })
//   ) as NodeEntry<IOrderedList>[]
//   for (const [node, path] of selectedOrderedListEntryArr) {
//     // 若该列表在文档首行, 将其设为列表头
//     if (path[0] === 0) {
//       if (node.indexState.type !== "head") {
//         Transforms.setNodes(
//           editor,
//           {
//             indexState: {
//               type: "head",
//               index: 1,
//             },
//           },
//           {
//             at: path,
//           }
//         )
//       }
//     } else {
//       const previousNode = Editor.node(editor, [path[0] - 1])[0]
//       // 如果 previousNode 为同级别的有序列表, 当前列表应为自增
//       // 否则当前列表设为列表头
//       if (
//         SlateElement.isElement(previousNode) &&
//         previousNode.type === "orderedList" &&
//         previousNode.indentLevel === node.indentLevel
//       ) {
//         if (node.indexState.type !== "selfIncrement") {
//           Transforms.setNodes(
//             editor,
//             {
//               indexState: {
//                 type: "selfIncrement",
//                 index: 1,
//               },
//             },
//             {
//               at: path,
//             }
//           )
//         }
//       } else {
//         if (node.indexState.type !== "head") {
//           Transforms.setNodes(
//             editor,
//             {
//               indexState: {
//                 type: "head",
//                 index: 1,
//               },
//             },
//             {
//               at: path,
//             }
//           )
//         }
//       }
//     }

//     // 当前列表在文档尾行时不存在 afterNode
//     if (path[0] !== editor.children.length - 1) {
//       const [afterNode, afterNodePath] = Editor.node(editor, [path[0] + 1])
//       // 如果 afterNode 为同级别的有序列表, 将其索引类型调为自增
//       if (
//         SlateElement.isElement(afterNode) &&
//         afterNode.type === "orderedList" &&
//         afterNode.indentLevel === node.indentLevel &&
//         afterNode.indexState.type !== "selfIncrement"
//       ) {
//         Transforms.setNodes(
//           editor,
//           {
//             indexState: {
//               type: "selfIncrement",
//               index: 1,
//             },
//           },
//           {
//             at: afterNodePath,
//           }
//         )
//       }
//     }
//   }
// }
export {}
