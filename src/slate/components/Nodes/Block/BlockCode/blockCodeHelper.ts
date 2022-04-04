import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { ParagraphType } from "../Paragraph/types"
import type { BlockCodeType, BlockCode_CodeLineType } from "./types"

//TODO: 行首直接添加一个空代码块 (需要新的toolbar?)
//TODO: 触发 toggleBlockCode, 选区开始于代码块外, 但包含代码块, 将整个选区合成为一个代码块
export const toggleBlockCode = (editor: Editor) => {
  if (!editor.selection) {
    console.error("toggleBlockCode() need editor.selection.")
    return
  }

  const selectedNodeEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
    })
  ) as NodeEntry<SlateElement>[]

  // 判断选区是否在代码块内, 若是, 将对应 CodeLine 拆分出来, 上下分割出两个代码块
  if (selectedNodeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
    // 选中的 codeLine
    const codeLineEntryArr = selectedNodeEntryArr.filter(
      ([node]) => node.type === "blockCode_codeLine"
    ) as NodeEntry<BlockCode_CodeLineType>[]

    // 根据选中 codeLine 生产的 paragraph
    const newNodes: ParagraphType[] = codeLineEntryArr.map(([node]) => {
      const newNode: ParagraphType = {
        type: "paragraph",
        children: node.children,
      }
      return newNode
    })

    // 选区所在的 blockCode
    const [blockCode, blockCodePath] = Array.from(
      Editor.nodes(editor, {
        at: editor.selection,
        match: (n) => SlateElement.isElement(n) && n.type === "blockCode",
      })
    )[0] as NodeEntry<BlockCodeType>
    const voidArea = blockCode.children[0]
    const codeArea = blockCode.children[1]
    const firstCodeLineIndex = codeLineEntryArr[0][1].slice(-1)[0]
    const lastCodeLineIndex = codeLineEntryArr.slice(-1)[0][1].slice(-1)[0]

    // 拆分后 -> startBlockCode - newParagraph - lastBlockCode
    // 关于 Object.assign({}, voidArea) -> https://github.com/ianstormtaylor/slate/issues/4309
    const startBlockCode: BlockCodeType = {
      type: "blockCode",
      children: [
        voidArea,
        {
          type: "blockCode_codeArea",
          lang: codeArea.lang,
          children: codeArea.children.slice(0, firstCodeLineIndex),
        },
        Object.assign({}, voidArea),
      ],
    }
    const lastBlockCode: BlockCodeType = {
      type: "blockCode",
      children: [
        voidArea,
        {
          type: "blockCode_codeArea",
          lang: codeArea.lang,
          children: codeArea.children.slice(lastCodeLineIndex + 1),
        },
        Object.assign({}, voidArea),
      ],
    }

    Transforms.removeNodes(editor, {
      at: blockCodePath,
    })
    Transforms.insertNodes(editor, [startBlockCode, ...newNodes, lastBlockCode], {
      at: blockCodePath,
    })
    const newPointPath = blockCodePath.slice(0, -1).concat([blockCodePath.slice(-1)[0] + newNodes.length])
    const newPoint = Editor.end(editor, newPointPath)
    Transforms.select(editor, newPoint)
    return
  }

  // 选区从 paragraph 开始, 判断选区是否包含代码块, 若是, 将选区合成一个大的代码块
  if (selectedNodeEntryArr.some(([node]) => node.type.startsWith("blockCode"))) {
  }

  const selectedParagraphNodes = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
    })
  ).map((item) => item[0]) as ParagraphType[]

  const newNodeChildren: BlockCode_CodeLineType[] = selectedParagraphNodes.map<BlockCode_CodeLineType>((item) => {
    return {
      type: "blockCode_codeLine",
      children: item.children,
    }
  })
  const newNode: BlockCodeType = {
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
        lang: "PlainText",
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
