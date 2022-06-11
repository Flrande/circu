// import { Editor, NodeEntry, Transforms } from "slate"
// import { SlateElement } from "../../../../types/slate"
// import type { IOrderedList } from "./types"

// /**
//  * 用于更新有序列表的索引, 并保证每一级的首个有序列表一定为列表头
//  *
//  * @param editor 当前编辑器实例
//  * @param entry 当前 entry
//  * @returns 一个布尔值, 若为真, 可提前结束当前规格化
//  *
//  */
// export const normalizeOrderedList = (editor: Editor, entry: NodeEntry) => {
//   const [currentNode] = entry

//   // 在规格化进行到 editor 时执行, 而不是进行到有序列表时执行
//   if (Editor.isEditor(currentNode)) {
//     const listEntryArr = Array.from(
//       Editor.nodes(editor, {
//         at: [],
//         match: (n) => SlateElement.isElement(n) && n.type === "ordered-list",
//       })
//     ) as NodeEntry<IOrderedList>[]

//     // 标记是否修改了文档树, 若修改了, 可提前结束当前规格化
//     let flag = false

//     // 遍历每一级的有序列表, 保证每一级的首个有序列表一定为列表头
//     for (let i = 1; i <= 16; i++) {
//       const currentListEntryArr = listEntryArr.filter(([node]) => node.indentLevel === i)

//       if (currentListEntryArr.length > 0) {
//         const [firstList, firstListPath] = currentListEntryArr[0]

//         if (firstList.indexState.type !== "head") {
//           Transforms.setNodes(
//             editor,
//             {
//               indexState: {
//                 type: "head",
//                 index: 1,
//               },
//             },
//             {
//               at: firstListPath,
//             }
//           )
//           flag = true
//         }
//       }
//     }
//     if (flag) {
//       return true
//     }

//     let currentIndex = 1
//     for (const [list, path] of listEntryArr) {
//       if (list.indexState.type === "head") {
//         currentIndex = list.indexState.index
//       } else {
//         currentIndex++

//         if (currentIndex !== list.indexState.index) {
//           Transforms.setNodes(
//             editor,
//             {
//               indexState: {
//                 type: list.indexState.type,
//                 index: currentIndex,
//               },
//             },
//             {
//               at: path,
//             }
//           )
//           flag = true
//         }
//       }
//     }
//     if (flag) {
//       return true
//     }
//   }

//   return false
// }
export {}
