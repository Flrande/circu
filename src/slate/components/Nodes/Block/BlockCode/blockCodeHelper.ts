import { Editor, NodeEntry, Transforms } from "slate"
import { PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { spiltBlockCode } from "./spiltBlockCode"
import type { IBlockCode, IBlockCode_CodeLine } from "./types"

export const isBlockCodeActive = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return false

  const match = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "blockCode",
    })
  )
  return match.length > 0 ? true : false
}

export const unToggleBlockCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("unToggleBlockCode() need editor.selection.")
    return
  }

  const selectedNodeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
    })
  ) as NodeEntry<SlateElement>[]

  // --------------------------------------------------
  // case-1
  // 选区在代码块内 -> 将对应 CodeLine 拆分出来, 上下分割出两个代码块
  // --------------------------------------------------
  if (selectedNodeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
    spiltBlockCode(editor, editor.selection)

    const newPoint = SlateRange.end(editor.selection)
    Transforms.select(editor, newPoint)

    // --------------------------------------------------
    // case-2
    // 选区从 paragraph 开始, 并包含代码块 -> 将选区合成一个大的代码块
    // --------------------------------------------------
  } else if (selectedNodeEntryArr.some(([node]) => node.type.startsWith("blockCode"))) {
    // 选中的段落型元素
    const selectedParagraphTypeEntryArr = selectedNodeEntryArr.filter(([node]) =>
      arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, node.type)
    ) as NodeEntry<ParagraphTypeElement>[]

    // 新的 blockCode
    const newNode: IBlockCode = {
      type: "blockCode",
      children: [
        {
          type: "blockCode_voidArea",
          children: [
            {
              text: "",
            },
          ],
        },
        {
          type: "blockCode_codeArea",
          langKey: "PlainText",
          children: selectedParagraphTypeEntryArr.map(([node]) => {
            const newItem: IBlockCode_CodeLine = {
              type: "blockCode_codeLine",
              children: node.children,
            }
            return newItem
          }),
        },
        {
          type: "blockCode_voidArea",
          children: [
            {
              text: "",
            },
          ],
        },
      ],
    }

    const selectedStartPath = SlateRange.start(editor.selection).path
    Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, newNode, {
      at: [selectedStartPath[0]],
    })
    const newPoint = Editor.end(editor, [selectedStartPath[0], 1])
    Transforms.select(editor, newPoint)
  } else {
    console.error("unToggleBlockCode() encounters a situation that cannot be handled.")
  }
}

//TODO: 行首直接添加一个空代码块 (需要新的toolbar?)
export const toggleBlockCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleBlockCode() need editor.selection.")
    return
  }

  if (isBlockCodeActive(editor)) {
    unToggleBlockCode(editor)
  } else {
    // 选中的段落型元素
    const selectedParagraphTypeNodes = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
      })
    ).map((item) => item[0]) as ParagraphTypeElement[]

    // 预期下 selectedParagraphTypeNodes 中不应含有 blockCode_codeLine,
    // 因为前面 isBlockCodeActive 已经判断过了
    if (selectedParagraphTypeNodes.some((node) => node.type === "blockCode_codeLine")) {
      console.error("toggleBlockCode() does not work as expected.")
      return
    }

    const newNodeChildren: IBlockCode_CodeLine[] = selectedParagraphTypeNodes.map<IBlockCode_CodeLine>((item) => {
      return {
        type: "blockCode_codeLine",
        children: item.children,
      }
    })
    const newNode: IBlockCode = {
      type: "blockCode",
      children: [
        {
          type: "blockCode_voidArea",
          children: [
            {
              text: "",
            },
          ],
        },
        {
          type: "blockCode_codeArea",
          langKey: "PlainText",
          children: newNodeChildren,
        },
        {
          type: "blockCode_voidArea",
          children: [
            {
              text: "",
            },
          ],
        },
      ],
    }

    const selectedStartPath = SlateRange.start(editor.selection).path
    Transforms.removeNodes(editor)
    Transforms.insertNodes(editor, newNode, {
      at: [selectedStartPath[0]],
    })
    Transforms.select(editor, Editor.end(editor, [selectedStartPath[0], 1]))
  }
}
