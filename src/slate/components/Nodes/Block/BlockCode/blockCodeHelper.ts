import { Editor, NodeEntry, Transforms } from "slate"
import { SlateElement, SlateRange } from "../../../../types/slate"
import type { IParagraph } from "../Paragraph/types"
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

//TODO: 行首直接添加一个空代码块 (需要新的toolbar?)
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

  // TODO-BUG: case-1, 代码块时仅有一行时 toggle 多出两个代码块
  // --------------------------------------------------
  // case-1
  // 判断选区是否在代码块内, 若是, 将对应 CodeLine 拆分出来, 上下分割出两个代码块
  // --------------------------------------------------
  if (selectedNodeEntryArr.every(([node]) => node.type.startsWith("blockCode"))) {
    // 选中的 codeLine
    const codeLineEntryArr = selectedNodeEntryArr.filter(
      ([node]) => node.type === "blockCode_codeLine"
    ) as NodeEntry<IBlockCode_CodeLine>[]

    // 根据选中 codeLine 生产的 paragraph
    const newNodes: IParagraph[] = codeLineEntryArr.map(([node]) => {
      const newNode: IParagraph = {
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
    )[0] as NodeEntry<IBlockCode>
    const voidArea = blockCode.children[0]
    const codeArea = blockCode.children[1]
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

    Transforms.removeNodes(editor, {
      at: blockCodePath,
    })
    Transforms.insertNodes(editor, [startBlockCode, ...newNodes, lastBlockCode], {
      at: blockCodePath,
    })
    const newPointPath = blockCodePath.slice(0, -1).concat([blockCodePath.slice(-1)[0] + newNodes.length])
    const newPoint = Editor.end(editor, newPointPath)
    Transforms.select(editor, newPoint)

    // --------------------------------------------------
    // case-2
    // 选区从 paragraph 开始, 判断选区是否包含代码块, 若是, 将选区合成一个大的代码块
    // --------------------------------------------------
  } else if (selectedNodeEntryArr.some(([node]) => node.type.startsWith("blockCode"))) {
    // 选中的 paragraph 和 blockCode
    const selectedEntryArr = selectedNodeEntryArr.filter(
      ([node]) => node.type === "paragraph" || node.type === "blockCode"
    ) as NodeEntry<IParagraph | IBlockCode>[]

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
          children: selectedEntryArr.flatMap(([node]) => {
            if (node.type === "paragraph") {
              const newItem: IBlockCode_CodeLine = {
                type: "blockCode_codeLine",
                children: node.children,
              }
              return newItem
            } else {
              const newItems: IBlockCode_CodeLine[] = node.children[1].children.map((node) => {
                const newItem: IBlockCode_CodeLine = {
                  type: "blockCode_codeLine",
                  children: node.children,
                }
                return newItem
              })
              return newItems
            }
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

    // --------------------------------------------------
    // case-3
    // 选区仅包括 paragraph
    // --------------------------------------------------
  } else {
    const selectedParagraphNodes = Array.from(
      Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
      })
    ).map((item) => item[0]) as IParagraph[]

    const newNodeChildren: IBlockCode_CodeLine[] = selectedParagraphNodes.map<IBlockCode_CodeLine>((item) => {
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
