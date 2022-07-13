import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement, SlateNode } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IQuote } from "../Quote/types"
import { getSelectedBlocks } from "../utils/getSelectedBlocks"
import type { IBlockCode } from "./types"

export const isBlockCodeActive = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection) return false

  const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
    except: ["quote"],
  })

  return selectedBlocks.every(([node]) => node.type === "block-code")
}

const unToggleBlockCode = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (!isBlockCodeActive(editor)) {
      return
    }

    const selectedBlockCodes = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
      except: ["quote"],
    }).filter(([node]) => node.type === "block-code") as NodeEntry<IBlockCode>[]

    if (selectedBlockCodes.length === 0) {
      return
    }

    const startPath = selectedBlockCodes[0][1]
    const endPath = selectedBlockCodes.at(-1)![1]

    for (const [, path] of selectedBlockCodes) {
      Transforms.unsetNodes(editor, CUSTOM_ELEMENT_PROPS_EXCEPT_CHILDREN, {
        at: path,
      })
      Transforms.setNodes(
        editor,
        {
          type: "paragraph",
        },
        {
          at: path,
        }
      )
    }

    Transforms.select(editor, Editor.range(editor, startPath, endPath))
  })
}

export const toggleBlockCode = (editor: Editor): void => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor
    if (!selection) {
      return
    }

    if (isBlockCodeActive(editor)) {
      unToggleBlockCode(editor)
    } else {
      const selectedBlocks = getSelectedBlocks<Exclude<BlockElementExceptTextLine, IQuote>>(editor, {
        except: ["quote"],
      })
      if (selectedBlocks.length === 0) {
        return
      }

      let goalBlocksIndex: number[] = []
      // 从非代码块的块级节点开始
      let tmpIndex = selectedBlocks.findIndex(([node]) => node.type !== "block-code")
      if (tmpIndex === -1) {
        return
      }
      while (true) {
        goalBlocksIndex.push(tmpIndex)
        tmpIndex = selectedBlocks.findIndex(
          ([, path], index) =>
            index > tmpIndex &&
            !Path.isCommon(selectedBlocks[tmpIndex][1], path) &&
            // 兄弟节点也分为一组
            !Path.isSibling(path, selectedBlocks[tmpIndex][1]) &&
            path.length < selectedBlocks[tmpIndex][1].length
        )
        if (tmpIndex === -1) {
          break
        }
      }

      if (goalBlocksIndex.length === 0) {
        return
      }

      for (const [i, blockIndex] of goalBlocksIndex.entries()) {
        const [goalBlock, goalBlockPath] = selectedBlocks[blockIndex]

        if (goalBlock.type === "block-code") {
          continue
        }

        // 当前循环要处理的块级节点
        const tmpBlocks =
          i === goalBlocksIndex.length - 1
            ? selectedBlocks.slice(blockIndex)
            : selectedBlocks.slice(blockIndex, goalBlocksIndex[i + 1])

        const newBlockCodes: IBlockCode[] = tmpBlocks.map(([node]) => {
          const blockCode: IBlockCode = {
            type: "block-code",
            langKey: "PlainText",
            children: [node.children[0]],
          }
          return blockCode
        })
        let newNodes: BlockElementExceptTextLine[] = newBlockCodes

        // 先将原本的块级节点删去
        Transforms.removeNodes(editor, {
          at: Path.parent(goalBlockPath),
          match: (n, p) => tmpBlocks.some(([, path]) => Path.equals(p, path)),
          mode: "highest",
        })

        // 对于最后一个 goalBlock, 要作特殊处理
        if (i === goalBlocksIndex.length - 1) {
          if (goalBlock.children.length > 1) {
            const goalBlockChildren: BlockElementExceptTextLine[] = Array.from(SlateNode.nodes(goalBlock.children[1]!))
              .filter(
                ([node, path]) =>
                  SlateElement.isElement(node) &&
                  arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, node.type) &&
                  !tmpBlocks.some(([, p]) => Path.equals(goalBlockPath.concat([1], path), p))
              )
              .map(([node]) => node) as BlockElementExceptTextLine[]

            newNodes = newNodes.concat(goalBlockChildren)
          }
        }

        // 插入新节点组
        Transforms.insertNodes(editor, newNodes, {
          at: goalBlockPath,
        })
      }

      const startPath: Path = selectedBlocks[0][1]

      const endGoalBlockPath: Path = selectedBlocks[goalBlocksIndex.at(-1)!][1]
      const endPath = endGoalBlockPath
        .slice(0, -1)
        .concat([endGoalBlockPath.at(-1)! + selectedBlocks.length - 1 - goalBlocksIndex.at(-1)!])

      Transforms.select(editor, Editor.range(editor, startPath, endPath))
    }
  })
}
