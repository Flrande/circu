import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_WITHOUT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementWithoutTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IQuote } from "../Quote/types"
import type { __IBlockElementChildren } from "./types"

/**
 * 用于检测选中的内容块能否缩进, 以下情况不可缩进:
 * 1. 选区上方的同级块级元素不支持缩进
 * 2. 选区上方没有同级的块级元素
 *
 * @param editor 编辑器实例
 * @returns 返回一个布尔值, 指示是否可缩进
 *
 */
export const inspectIndentable = (editor: Editor) => {
  const { selection } = editor
  if (!selection) {
    console.error("inspectIndentable() need editor.selection.")
    return
  }

  const firstBlockEntry = Array.from(
    Editor.nodes(editor, {
      at: Editor.start(editor, selection),
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
      mode: "lowest",
    })
  )[0] as NodeEntry<BlockElementWithoutTextLine>

  if (!firstBlockEntry) {
    return false
  }

  const previousNodeEntry = Editor.previous(editor, {
    at: firstBlockEntry[1],
    match: (n, p) =>
      SlateElement.isElement(n) &&
      arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
      // 引用不支持
      n.type !== "quote" &&
      p.length >= firstBlockEntry[1].length,
    mode: "highest",
  })

  if (!previousNodeEntry) {
    return false
  }

  return true
}

/**
 * 用于内容块缩进的函数, 即将选中的块级节点移入前一个块级节点的子节点块
 *
 * @param editor 编辑器实例
 *
 */
export const toggleIndent = (editor: Editor) => {
  const { selection } = editor
  if (!selection) {
    console.error("toggleIndent() need editor.selection.")
    return
  }

  const firstBlockEntry = Array.from(
    Editor.nodes(editor, {
      at: Editor.start(editor, selection),
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
      mode: "lowest",
    })
  )[0] as NodeEntry<BlockElementWithoutTextLine>

  if (!firstBlockEntry) {
    return
  }
  const [, firstBlockPath] = firstBlockEntry

  const tmpBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
        p.length <= firstBlockPath.length,
      mode: "lowest",
    })
  ) as NodeEntry<BlockElementWithoutTextLine>[]

  if (tmpBlocksEntry.length < 1) {
    return
  }

  const previousNodeEntry = Editor.previous(editor, {
    at: tmpBlocksEntry[0][1],
    match: (n, p) =>
      SlateElement.isElement(n) &&
      arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
      // 引用不支持
      n.type !== "quote" &&
      p.length >= firstBlockPath.length,
    mode: "highest",
  }) as NodeEntry<Exclude<BlockElementWithoutTextLine, IQuote>> | undefined

  // 判断是否可以缩进
  if (!previousNodeEntry) {
    return
  }
  const [previousNode, previousNodePath] = previousNodeEntry

  if (previousNode.children.length === 1) {
    // 若上方块级节点还未有子节点块, 插入子节点块
    const newNode: __IBlockElementChildren = {
      type: "__block-element-children",
      children: tmpBlocksEntry.map(([node]) => node),
    }

    Transforms.removeNodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
    })

    Transforms.insertNodes(editor, newNode, {
      at: previousNodePath.concat([1]),
      select: true,
    })

    Transforms.select(editor, {
      anchor: Editor.start(editor, previousNodePath.concat([1])),
      focus: Editor.end(editor, previousNodePath.concat([1])),
    })
  } else if (previousNode.children.length === 2) {
    // 若上方块级节点已有节点块, 直接在子节点块中插入节点
    Transforms.removeNodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
    })

    Transforms.insertNodes(
      editor,
      tmpBlocksEntry.map(([node]) => node),
      {
        at: previousNodePath.concat([1, previousNode.children[1].children.length]),
      }
    )

    Transforms.select(editor, {
      anchor: Editor.start(editor, previousNodePath.concat([1, previousNode.children[1].children.length])),
      focus: Editor.end(editor, previousNodePath.concat([1])),
    })
  } else {
    console.error(`BlockElement ${previousNode} in ${previousNodePath} has more than two children.`)
  }
}

/**
 * 用于取消内容块缩进的函数, 即将选中的块级节点移出当前块级节点的子节点块
 *
 * @param editor 编辑器实例
 *
 */
export const unToggleIndent = (editor: Editor) => {
  const { selection } = editor
  if (!selection) {
    console.error("toggleIndent() need editor.selection.")
    return
  }

  const firstBlockEntry = Array.from(
    Editor.nodes(editor, {
      at: Editor.start(editor, selection),
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
      mode: "lowest",
    })
  )[0] as NodeEntry<BlockElementWithoutTextLine>

  if (!firstBlockEntry) {
    return
  }
  const [, firstBlockPath] = firstBlockEntry

  const [firstBlockParent, firstBlockParentPath] = Editor.node(editor, Path.parent(firstBlockPath))
  // 判断是否在某个块级节点的子节点块内
  if (!SlateElement.isElement(firstBlockParent) || firstBlockParent.type !== "__block-element-children") {
    return
  }

  const tmpBlocksEntry = Array.from(
    Editor.nodes(editor, {
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
        p.length <= firstBlockPath.length,
      mode: "lowest",
    })
  ) as NodeEntry<BlockElementWithoutTextLine>[]

  if (tmpBlocksEntry.length < 1) {
    return
  }

  const [, firstBlockGrandfatherPath] = Editor.node(editor, firstBlockPath.slice(0, -2))

  Transforms.removeNodes(editor, {
    match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
  })
  // 若子节点块被清空, 删除子节点块
  if (
    (firstBlockParent as __IBlockElementChildren).children.length ===
    tmpBlocksEntry.filter(([, path]) => Path.isSibling(path, firstBlockPath) || Path.equals(path, firstBlockPath))
      .length
  ) {
    Transforms.removeNodes(editor, {
      at: firstBlockParentPath,
    })
  }

  Transforms.insertNodes(
    editor,
    tmpBlocksEntry.map(([node]) => node),
    {
      at: Path.next(firstBlockGrandfatherPath),
    }
  )

  Transforms.select(editor, {
    anchor: Editor.start(editor, Path.next(firstBlockGrandfatherPath)),
    focus: Editor.end(
      editor,
      firstBlockGrandfatherPath.slice(0, -1).concat([firstBlockGrandfatherPath.at(-1)! + tmpBlocksEntry.length])
    ),
  })
}
