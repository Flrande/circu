import { Editor, NodeEntry, Transforms } from "slate"
import { PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { spiltBlockCode } from "../BlockCode/blockCodeUtils"
import type { IList } from "./types"

export const isListActive = (editor: Editor, listType: IList["listType"]) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "list" && n.listType === listType,
    })
  )

  return match.length > 0 ? true : false
}

export const toggleList = (editor: Editor, listType: IList["listType"]) => {
  if (!editor.selection) {
    console.error("toggleOrderedList() need editor.selection.")
    return
  }

  const selectedParagraphTypeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as Array<NodeEntry<ParagraphTypeElement>>

  let newNodes: IList[] = selectedParagraphTypeEntryArr.map(([node]) => {
    const list: IList =
      listType === "ordered"
        ? {
            type: "list",
            listType,
            orderedListMode: "selfIncrement",
            index: 1,
            headIndex: 1,
            children: node.children,
          }
        : {
            type: "list",
            listType,
            children: node.children,
          }
    return list
  })

  // 选区在代码块内, 先将 codeLine 分离出来
  if (selectedParagraphTypeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
    // spiltBlockCode 执行完成后 editor.selection 仍为对应选区
    spiltBlockCode(editor, editor.selection)
  }

  // newNodes 中头尾 list 的 Path
  const firstPath = SlateRange.start(editor.selection).path.slice(0, 1)
  const lastPath = [firstPath[0] + newNodes.length - 1]

  // 当且仅当 toggleList 生成有序列表时才需处理编号
  if (listType === "ordered") {
    // 如果 newNodes 中首个 list 在文档首行, 将其 orderedListMode 设为 head
    if (firstPath[0] === 0) {
      newNodes[0].orderedListMode = "head"
    } else {
      const previousNode = Editor.node(editor, [firstPath[0] - 1])[0]
      // 如果 previousNode 不为有序列表,
      // newNodes 中的首个 list 类型转为 head
      if (
        !(SlateElement.isElement(previousNode) && previousNode.type === "list" && previousNode.listType === "ordered")
      ) {
        newNodes[0].orderedListMode = "head"
      }
    }

    // newNodes 最后一个 list 为文档尾行时不存在 afterNode
    if (lastPath[0] !== editor.children.length - 1) {
      const [afterNode, afterNodePath] = Editor.node(editor, [lastPath[0] + 1])
      // 如果 afterNode 为有序列表, 将其 orderedListMode 设为 selfIncrement
      if (SlateElement.isElement(afterNode) && afterNode.type === "list" && afterNode.listType === "ordered") {
        Transforms.setNodes(
          editor,
          {
            orderedListMode: "selfIncrement",
          },
          {
            at: afterNodePath,
          }
        )
      }
    }
  }

  Transforms.removeNodes(editor, {
    at: editor.selection,
  })
  Transforms.insertNodes(editor, newNodes, {
    at: firstPath,
  })

  const lastPoint = SlateRange.end(Editor.range(editor, lastPath))
  Transforms.select(editor, lastPoint)
}
