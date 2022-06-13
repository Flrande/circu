import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_JUST_WITH_CHILDREN, BLOCK_ELEMENTS_WITHOUT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementJustWithChildren, BlockElementWithoutTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { MAX_INDENT_LEVEL } from "./constant"
import type { __IBlockElementChildren } from "./types"

/**
 * 用于检测选中的内容块能否增加缩进, 以下情况不可增加缩进:
 * 1. 到达最大缩进级别
 * 2. 选区上方的块级节点的缩进级别不支持增加缩进
 * 3. 选区上方的块级节点本身不支持缩进
 *
 * @param editor 编辑器实例
 * @returns 返回一个包含是否可增加缩进以及为何不可增加缩进信息的对象
 *
 * indentable  - 是否可缩进
 *
 * type - 0 - 未知情况
 *
 * type - 1 - 到达最大缩进级别
 *
 * type - 2 - 选区上方的块级节点的缩进级别不支持缩进
 *
 * type - 3 - 选区上方的块级节点本身不支持缩进
 */
export const inspectIncreaseIndentable: (editor: Editor) =>
  | {
      indentable: false
      type: "0" | "1" | "2" | "3"
    }
  | {
      indentable: true
    } = (editor) => {
  const { selection } = editor
  if (!selection) {
    return {
      indentable: false,
      type: "0",
    }
  }

  const firstBlockEntry = Array.from(
    Editor.nodes(editor, {
      at: Editor.start(editor, selection),
      match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
      mode: "lowest",
    })
  )[0] as NodeEntry<BlockElementWithoutTextLine>

  if (!firstBlockEntry) {
    return {
      indentable: false,
      type: "0",
    }
  }

  const [, firstBlockPath] = firstBlockEntry

  // 判断是否到达最大缩进级别
  if (calculateIndentLevel(editor, firstBlockPath) >= MAX_INDENT_LEVEL) {
    return {
      indentable: false,
      type: "1",
    }
  }

  const previousNodeEntry = Editor.previous(editor, {
    at: firstBlockPath,
    match: (n) => SlateElement.isElement(n) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type),
    mode: "lowest",
  }) as NodeEntry<BlockElementWithoutTextLine> | undefined

  if (!previousNodeEntry) {
    return {
      indentable: false,
      type: "0",
    }
  }

  const [previousNode, previousNodePath] = previousNodeEntry

  if (previousNodePath.length < firstBlockPath.length) {
    return {
      indentable: false,
      type: "2",
    }
  }

  if (arrayIncludes(BLOCK_ELEMENTS_JUST_WITH_CHILDREN, previousNode.type)) {
    return {
      indentable: false,
      type: "3",
    }
  }

  return {
    indentable: true,
  }
}

/**
 * 用于增加内容块缩进的函数, 即将选中的块级节点移入前一个块级节点的子节点块
 *
 * @param editor 编辑器实例
 *
 */
export const increaseIndent = (editor: Editor) => {
  const { selection } = editor
  if (!selection) {
    return
  }

  // 判断是否可以缩进
  if (!inspectIncreaseIndentable(editor).indentable) {
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

  if (calculateIndentLevel(editor, firstBlockPath) >= MAX_INDENT_LEVEL) {
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

  const previousNodeEntry = Editor.previous(editor, {
    at: tmpBlocksEntry[0][1],
    match: (n, p) =>
      SlateElement.isElement(n) &&
      arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
      !arrayIncludes(BLOCK_ELEMENTS_JUST_WITH_CHILDREN, n.type) &&
      p.length >= firstBlockPath.length,
    mode: "lowest",
  }) as NodeEntry<Exclude<BlockElementWithoutTextLine, BlockElementJustWithChildren>> | undefined

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
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
        p.length <= firstBlockPath.length,
      mode: "lowest",
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
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
        p.length <= firstBlockPath.length,
      mode: "lowest",
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
 * 用于减少内容块缩进的函数, 即将选中的块级节点移出当前块级节点的子节点块
 *
 * @param editor 编辑器实例
 *
 */
export const decreaseIndent = (editor: Editor) => {
  const { selection } = editor
  if (!selection) {
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
    match: (n, p) =>
      SlateElement.isElement(n) &&
      arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, n.type) &&
      p.length <= firstBlockPath.length,
    mode: "lowest",
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

/**
 * 计算块级节点嵌套级别的函数
 *
 * @param editor 编辑器实例
 * @param path 块级节点的 Path
 * @returns 嵌套级别, 最小为0
 *
 */
export const calculateIndentLevel = (editor: Editor, path: Path) => {
  const [currentNode] = Editor.node(editor, path)
  if (!SlateElement.isElement(currentNode) || !arrayIncludes(BLOCK_ELEMENTS_WITHOUT_TEXT_LINE, currentNode.type)) {
    throw `calculateIndentLevel() get unexpected path, maybe it is not an element or text-line`
  }

  const ancestorsPath = Path.ancestors(path)

  // 计算方法: 从 Editor 或仅含子节点块的块级节点开始计算 Path 的长度
  const bottomPath = ancestorsPath.find((path) => {
    const [tmpNode] = Editor.node(editor, path)

    if (Editor.isEditor(tmpNode)) {
      return true
    }

    if (SlateElement.isElement(tmpNode) && arrayIncludes(BLOCK_ELEMENTS_JUST_WITH_CHILDREN, tmpNode.type)) {
      return true
    }

    return false
  })

  if (!bottomPath) {
    throw `can not find bottom node for node in ${path}}`
  }

  return Math.floor((path.length - bottomPath.length - 1) / 2)
}