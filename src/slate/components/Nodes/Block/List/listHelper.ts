import { Editor, NodeEntry, Transforms } from "slate"
import { INDENT_TYPE_ELEMENTS, PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { IndentTypeElement, ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { splitBlockCode } from "../BlockCode/splitBlockCode"
import type { IParagraphIndentLevel } from "../Paragraph/types"
import { splitQuote } from "../Quote/splitQuote"
import type { IListIndentLevel, IOrderedList, IUnorderedList } from "./types"

//FIXME: 横跨段落块以外的块级元素并触发 toggle 逻辑时会报错, 初步判断是 Transforms.removeNodes 的问题
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

const unToggleList = (editor: Editor) => {
  if (!editor.selection) {
    console.error("unToggleList() need editor.selection.")
    return
  }

  const selectedParagraphTypeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as Array<NodeEntry<ParagraphTypeElement>>

  for (const [node, path] of selectedParagraphTypeEntryArr) {
    let level: IParagraphIndentLevel = 0
    if (arrayIncludes(INDENT_TYPE_ELEMENTS, node.type)) {
      const tmpNode = node as IndentTypeElement
      if (tmpNode.indentLevel >= 1 && tmpNode.indentLevel <= 16) {
        level = (tmpNode.indentLevel - 1) as IParagraphIndentLevel
      }
    }

    Transforms.removeNodes(editor, {
      at: path,
    })
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        indentLevel: level,
        children: node.children,
      },
      {
        at: path,
      }
    )
  }

  const newRange: SlateRange = {
    anchor: Editor.start(editor, selectedParagraphTypeEntryArr[0][1]),
    focus: Editor.end(editor, selectedParagraphTypeEntryArr[selectedParagraphTypeEntryArr.length - 1][1]),
  }
  Transforms.select(editor, newRange)
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

  // 注意这里判断条件不是 isListActive()
  if (selectedParagraphTypeEntryArr.every(([node]) => node.type === "orderedList")) {
    // 仅当被选中的段落型元素均为有序列表时才触发该函数
    unToggleList(editor)
  } else {
    let newNodes: IOrderedList[] = selectedParagraphTypeEntryArr.map(([node]) => {
      let level: IListIndentLevel = 1
      if (arrayIncludes(INDENT_TYPE_ELEMENTS, node.type)) {
        const tmpNode = node as IndentTypeElement
        if (tmpNode.indentLevel >= 1 && tmpNode.indentLevel <= 16) {
          level = tmpNode.indentLevel as IListIndentLevel
        }
      }

      const list: IOrderedList = {
        type: "orderedList",
        indentLevel: level,
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
      // splitBlockCode 执行完成后 editor.selection 仍为对应选区
      splitBlockCode(editor, editor.selection)
    }

    // 选区在引用块内, 先将 quoteLine 分离出来
    if (selectedParagraphTypeEntryArr.every(([node]) => node.type.startsWith("quote"))) {
      // splitQuote 执行完成后 editor.selection 仍为对应选区
      splitQuote(editor, editor.selection)
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
          previousNode.indentLevel === newNodes[0].indentLevel
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
        afterNode.indentLevel === newNodes[newNodes.length - 1].indentLevel
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

    const newRange: SlateRange = {
      anchor: Editor.start(editor, firstPath),
      focus: Editor.end(editor, lastPath),
    }
    Transforms.select(editor, newRange)
  }
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

  // 注意这里判断条件不是 isListActive()
  if (selectedParagraphTypeEntryArr.every(([node]) => node.type === "unorderedList")) {
    // 仅当被选中的段落型元素均为无序列表时才触发该函数
    unToggleList(editor)
  } else {
    let newNodes: IUnorderedList[] = selectedParagraphTypeEntryArr.map(([node]) => {
      let level: IListIndentLevel = 1
      if (arrayIncludes(INDENT_TYPE_ELEMENTS, node.type)) {
        const tmpNode = node as IndentTypeElement
        if (tmpNode.indentLevel >= 1 && tmpNode.indentLevel <= 16) {
          level = tmpNode.indentLevel as IListIndentLevel
        }
      }

      const list: IUnorderedList = {
        type: "unorderedList",
        indentLevel: level,
        children: node.children,
      }
      return list
    })

    // 选区在代码块内, 先将 codeLine 分离出来
    if (selectedParagraphTypeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
      // splitBlockCode 执行完成后 editor.selection 仍为对应选区
      splitBlockCode(editor, editor.selection)
    }

    // 选区在引用块内, 先将 quoteLine 分离出来
    if (selectedParagraphTypeEntryArr.every(([node]) => node.type.startsWith("quote"))) {
      // splitQuote 执行完成后 editor.selection 仍为对应选区
      splitQuote(editor, editor.selection)
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

    const newRange: SlateRange = {
      anchor: Editor.start(editor, firstPath),
      focus: Editor.end(editor, lastPath),
    }
    Transforms.select(editor, newRange)
  }
}
