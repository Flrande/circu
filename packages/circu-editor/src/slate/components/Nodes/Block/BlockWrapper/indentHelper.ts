import { Editor, NodeEntry, Path, Point, Transforms } from "slate"
import {
  BLOCK_ELEMENTS_WITH_CHILDREN,
  BLOCK_ELEMENTS_EXCEPT_TEXT_LINE,
  BLOCK_ELEMENTS_WITHOUT_CHILDREN,
} from "../../../../types/constant"
import type { BlockElementWithChildren, BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import { unToggleFold } from "../../../FoldButton/foldHelper"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import { MAX_INDENT_LEVEL } from "./constant"
import type { __IBlockElementChildren } from "./types"

/**
 * 用于检测 path 对应的块级节点能否增加缩进, 以下情况不可增加缩进:
 * 1. 到达最大缩进级别
 * 2. 上方的块级节点的缩进级别不支持增加缩进
 * 3. 上方的块级节点本身不支持缩进
 *
 * @param editor 编辑器实例
 * @param path 块级节点的位置
 * @returns 返回一个包含是否可增加缩进以及为何不可增加缩进信息的对象
 *
 * indentable  - 是否可缩进
 *
 * type - 0 - 未定义情况
 *
 * type - 1 - 到达最大缩进级别
 *
 * type - 2 - 选区上方的块级节点的缩进级别不支持缩进
 *
 * type - 3 - 选区上方的块级节点不支持接受子节点
 */
export const inspectIncreaseIndentable = (
  editor: Editor,
  path: Path
):
  | {
      indentable: false
      type: "0" | "1" | "2" | "3"
    }
  | {
      indentable: true
    } => {
  const [node, nodePath] = Editor.node(editor, path)

  // 判断 path 对应的节点是否支持缩进
  if (!SlateElement.isElement(node)) {
    return {
      indentable: false,
      type: "0",
    }
  }
  if (!arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, node.type)) {
    return {
      indentable: false,
      type: "0",
    }
  }

  // 判断是否到达最大缩进级别
  if (calculateIndentLevel(editor, nodePath) >= MAX_INDENT_LEVEL) {
    return {
      indentable: false,
      type: "1",
    }
  }

  const previousNodeEntry = Editor.previous(editor, {
    at: nodePath,
    match: (n, p) =>
      SlateElement.isElement(n) &&
      arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
      p.length <= nodePath.length,
    mode: "lowest",
  }) as NodeEntry<BlockElementExceptTextLine> | undefined

  if (!previousNodeEntry) {
    return {
      indentable: false,
      type: "0",
    }
  }

  const [previousNode, previousNodePath] = previousNodeEntry

  if (previousNodePath.length < nodePath.length) {
    return {
      indentable: false,
      type: "2",
    }
  }

  if (!arrayIncludes(BLOCK_ELEMENTS_WITH_CHILDREN, previousNode.type)) {
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
 * 用于增加内容块缩进的函数
 *
 * @param editor 编辑器实例
 * @param range 要处理的选区, 默认为 editor.selection
 *
 */
export const increaseIndent = (editor: Editor, range?: SlateRange): void => {
  Editor.withoutNormalizing(editor, () => {
    let goalRange: SlateRange | null = null
    if (!range) {
      goalRange = editor.selection
    } else {
      goalRange = range
    }

    if (!goalRange) {
      return
    }

    const selectedBlocks = getSelectedBlocks(editor, {
      range: goalRange,
    })

    if (selectedBlocks.length === 0) {
      return
    }

    let goalBlocks: NodeEntry<BlockElementExceptTextLine>[] = []
    let tmpIndex = 0
    while (true) {
      goalBlocks.push(selectedBlocks[tmpIndex])
      tmpIndex = selectedBlocks.findIndex(
        ([, path], index) => index > tmpIndex && !Path.isCommon(selectedBlocks[tmpIndex][1], path)
      )
      if (tmpIndex === -1) {
        break
      }
    }

    if (goalBlocks.length === 0) {
      return
    }

    // 判断是否可以缩进
    if (!inspectIncreaseIndentable(editor, goalBlocks[0][1]).indentable) {
      return
    }

    const [, firstNodePath] = goalBlocks[0]
    const previousNodeEntry = Editor.previous(editor, {
      at: firstNodePath,
      match: (n, p) =>
        SlateElement.isElement(n) &&
        arrayIncludes(BLOCK_ELEMENTS_WITH_CHILDREN, n.type) &&
        p.length <= firstNodePath.length,
      mode: "lowest",
    }) as NodeEntry<BlockElementWithChildren> | undefined

    if (!previousNodeEntry) {
      return
    }

    const [previousNode, previousNodePath] = previousNodeEntry

    // 若上方块级节点为折叠状态, 取消其折叠
    if (previousNode.isFolded) {
      unToggleFold(editor, previousNodePath)
    }

    if (previousNode.children.length === 1) {
      // 若上方块级节点还未有子节点块
      const newNode: __IBlockElementChildren = {
        type: "__block-element-children",
        children: goalBlocks.map(([node]) => node),
      }

      Transforms.removeNodes(editor, {
        at: goalRange,
        match: (n, p) => goalBlocks.some(([, path]) => Path.equals(path, p)),
      })

      Transforms.insertNodes(editor, newNode, {
        at: previousNodePath.concat([1]),
      })

      // 还原选区
      const [start, end] = Editor.edges(editor, goalRange)

      const newAnchor: Point = {
        path: previousNodePath.concat([1, 0], start.path.slice(goalBlocks[0][1].length)),
        offset: start.offset,
      }
      const newFocus: Point = {
        path: previousNodePath.concat([1, goalBlocks.length - 1], end.path.slice(goalBlocks.at(-1)![1].length)),
        offset: end.offset,
      }

      Transforms.select(editor, {
        anchor: newAnchor,
        focus: newFocus,
      })
    } else {
      // 若上方块级节点已有节点块
      Transforms.removeNodes(editor, {
        at: goalRange,
        match: (n, p) => goalBlocks.some(([, path]) => Path.equals(path, p)),
      })

      Transforms.insertNodes(
        editor,
        goalBlocks.map(([node]) => node),
        {
          at: previousNodePath.concat([1, previousNode.children[1].children.length]),
        }
      )

      // 还原选区
      const [start, end] = Editor.edges(editor, goalRange)

      const newAnchor: Point = {
        path: previousNodePath.concat(
          [1, previousNode.children[1].children.length],
          start.path.slice(goalBlocks[0][1].length)
        ),
        offset: start.offset,
      }
      const newFocus: Point = {
        path: previousNodePath.concat(
          [1, previousNode.children[1].children.length + goalBlocks.length - 1],
          end.path.slice(goalBlocks.at(-1)![1].length)
        ),
        offset: end.offset,
      }

      Transforms.select(editor, {
        anchor: newAnchor,
        focus: newFocus,
      })
    }
  })
}

/**
 * 用于减少内容块缩进的函数
 *
 * @param editor 编辑器实例
 * @param range 要处理的选区, 默认为 editor.selection
 *
 */
export const decreaseIndent = (editor: Editor, range?: SlateRange): void => {
  Editor.withoutNormalizing(editor, () => {
    let goalRange: SlateRange | null = null
    if (!range) {
      goalRange = editor.selection
    } else {
      goalRange = range
    }

    if (!goalRange) {
      return
    }

    const selectedBlocks = getSelectedBlocks(editor, {
      range: goalRange,
    })

    if (selectedBlocks.length === 0) {
      return
    }

    let goalBlocks: NodeEntry<BlockElementExceptTextLine>[] = []
    let tmpIndex = 0
    while (true) {
      goalBlocks.push(selectedBlocks[tmpIndex])
      tmpIndex = selectedBlocks.findIndex(
        ([, path], index) => index > tmpIndex && !Path.isCommon(selectedBlocks[tmpIndex][1], path)
      )
      if (tmpIndex === -1) {
        break
      }
    }

    if (goalBlocks.length === 0) {
      return
    }

    const [, firstNodePath] = goalBlocks[0]
    const [firstNodeParent, firstNodeParentPath] = Editor.node(editor, Path.parent(firstNodePath))

    // 判断是否在某个块级节点的子节点块内
    if (SlateElement.isElement(firstNodeParent) && firstNodeParent.type === "__block-element-children") {
      // 待处理的块级节点的移动目的地, 即父块级节点之后的第一个位置
      const newFirstNodePath = Path.next(Path.parent(firstNodeParentPath))

      // 如果要处理的块级节点都在同一层, 将这些块级节点上浮一层
      if (goalBlocks.every(([, path]) => Path.isSibling(path, firstNodePath) || Path.equals(path, firstNodePath))) {
        // 待处理区域后仍有同级节点的, 将这些同级节点移入最后一个待处理块级节点的子节点块中
        const rearBlocks = firstNodeParent.children.slice(firstNodePath.at(-1)! + goalBlocks.length)

        Transforms.removeNodes(editor, {
          at: firstNodeParentPath,
          match: (n, p) =>
            (Path.isSibling(p, firstNodePath) && Path.isAfter(p, firstNodePath)) || Path.equals(p, firstNodePath),
        })

        if (Path.equals(firstNodePath, firstNodeParentPath.concat([0]))) {
          // 要处理的首个块级节点为子节点块的首个子节点时, 子节点块会被清空
          Transforms.removeNodes(editor, {
            at: firstNodeParentPath,
          })
        }

        // 将选中的块级节点上浮
        Transforms.insertNodes(
          editor,
          goalBlocks.map(([node]) => node),
          {
            at: newFirstNodePath,
          }
        )
        // 将处理区域后的同级节点移入最后一个待处理块级节点的子节点块中
        if (rearBlocks.length > 0) {
          Transforms.insertNodes(
            editor,
            {
              type: "__block-element-children",
              children: rearBlocks,
            },
            {
              at: newFirstNodePath.concat([1]),
            }
          )
        }
      } else {
        Transforms.removeNodes(editor, {
          at: goalRange,
          match: (n, p) => goalBlocks.some(([, path]) => Path.equals(path, p)),
        })

        // 若子节点块将被清空, 删除子节点块
        if (
          firstNodeParent.children.length ===
          goalBlocks.filter(([, path]) => Path.isSibling(path, firstNodePath) || Path.equals(path, firstNodePath))
            .length
        ) {
          Transforms.removeNodes(editor, {
            at: firstNodeParentPath,
          })
        }

        Transforms.insertNodes(
          editor,
          goalBlocks.map(([node]) => node),
          {
            at: newFirstNodePath,
          }
        )
      }

      // 还原选区
      const [start, end] = Editor.edges(editor, goalRange)

      const newAnchor: Point = {
        path: newFirstNodePath.concat(start.path.slice(goalBlocks[0][1].length)),
        offset: start.offset,
      }
      const newFocus: Point = {
        path: newFirstNodePath
          .slice(0, -1)
          .concat([newFirstNodePath.at(-1)! + goalBlocks.length - 1], end.path.slice(goalBlocks.at(-1)![1].length)),
        offset: end.offset,
      }

      Transforms.select(editor, {
        anchor: newAnchor,
        focus: newFocus,
      })
    }
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
export const calculateIndentLevel = (editor: Editor, path: Path): number => {
  const [currentNode] = Editor.node(editor, path)
  if (!SlateElement.isElement(currentNode) || !arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, currentNode.type)) {
    throw `calculateIndentLevel() get unexpected path, maybe its node is text-line or not a block element`
  }

  const ancestorsPath = Path.ancestors(path)

  // 计算方法: 从 Editor 或仅含子节点块的块级节点开始计算 Path 的长度
  const bottomPath = ancestorsPath.reverse().find((path) => {
    const [tmpNode] = Editor.node(editor, path)

    if (Editor.isEditor(tmpNode)) {
      return true
    }

    if (SlateElement.isElement(tmpNode) && arrayIncludes(BLOCK_ELEMENTS_WITHOUT_CHILDREN, tmpNode.type)) {
      return true
    }

    return false
  })

  if (!bottomPath) {
    throw `can not find bottom node for node in ${path}}`
  }

  return Math.floor((path.length - bottomPath.length - 1) / 2)
}
