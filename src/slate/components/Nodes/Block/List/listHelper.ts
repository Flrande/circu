import { Editor, NodeEntry, Transforms } from "slate"
import { PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { spiltBlockCode } from "../BlockCode/spiltBlockCode"
import type { IOrderedList, IUnorderedList } from "./types"

export const isListActive = (editor: Editor, listType: IOrderedList["type"] | IUnorderedList["type"]) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === listType,
    })
  )

  return match.length > 0 ? true : false
}

export const toggleOrderedList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleOrderedList() need editor.selection.")
    return
  }

  const selectedParagraphTypeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as Array<NodeEntry<ParagraphTypeElement>>

  let newNodes: IOrderedList[] = selectedParagraphTypeEntryArr.map(([node]) => {
    let level =
      node.type === "paragraph"
        ? node.indentLevel
        : node.type === "orderedList" || node.type === "unorderedList"
        ? node.listLevel
        : 1
    if (level === 0) {
      level = 1
    }

    const list: IOrderedList = {
      type: "orderedList",
      listLevel: level,
      indexState: {
        type: "selfIncrement",
        index: 1,
      },
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

  // 如果 newNodes 中首个 list 在文档首行, 将其设为列表头
  if (firstPath[0] === 0) {
    newNodes[0].indexState.type = "head"
  } else {
    const previousNode = Editor.node(editor, [firstPath[0] - 1])[0]
    // 如果 previousNode 不为同级别的有序列表 (对于 newNodes 中的首个 list),
    // 将 newNodes 中的首个 list 设为列表头
    if (
      !(
        SlateElement.isElement(previousNode) &&
        previousNode.type === "orderedList" &&
        previousNode.listLevel === newNodes[0].listLevel
      )
    ) {
      newNodes[0].indexState.type = "head"
    }
  }

  // newNodes 中最后一个 list 在文档尾行时不存在 afterNode
  if (lastPath[0] !== editor.children.length - 1) {
    const [afterNode, afterNodePath] = Editor.node(editor, [lastPath[0] + 1])
    // 如果 afterNode 为同级别的有序列表 (对于 newNodes 中最后一个 list), 将其索引类型调为自增
    if (
      SlateElement.isElement(afterNode) &&
      afterNode.type === "orderedList" &&
      afterNode.listLevel === newNodes[newNodes.length - 1].listLevel
    ) {
      Transforms.setNodes(
        editor,
        {
          indexState: {
            type: "selfIncrement",
            index: 1,
          },
        },
        {
          at: afterNodePath,
        }
      )
    }
  }

  Transforms.removeNodes(editor, {
    at: editor.selection,
  })
  Transforms.insertNodes(editor, newNodes, {
    at: firstPath,
  })

  Transforms.select(editor, Editor.end(editor, lastPath))
}

export const toggleUnorderedList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleUnorderedList() need editor.selection.")
    return
  }

  const selectedParagraphTypeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as Array<NodeEntry<ParagraphTypeElement>>

  let newNodes: IUnorderedList[] = selectedParagraphTypeEntryArr.map(([node]) => {
    let level =
      node.type === "paragraph"
        ? node.indentLevel
        : node.type === "orderedList" || node.type === "unorderedList"
        ? node.listLevel
        : 1
    if (level === 0) {
      level = 1
    }

    const list: IUnorderedList = {
      type: "unorderedList",
      listLevel: level,
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

  Transforms.removeNodes(editor, {
    at: editor.selection,
  })
  Transforms.insertNodes(editor, newNodes, {
    at: firstPath,
  })

  Transforms.select(editor, Editor.end(editor, lastPath))
}
