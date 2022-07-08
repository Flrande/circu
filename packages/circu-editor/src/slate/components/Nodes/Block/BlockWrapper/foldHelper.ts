import { Editor, NodeEntry, Path, Transforms } from "slate"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE } from "../../../../types/constant"
import type { BlockElementExceptTextLine } from "../../../../types/interface"
import { SlateElement } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IHead } from "../Head/types"

const handleFold = (editor: Editor, path: Path, action: "toggle" | "unToggle"): void => {
  Editor.withoutNormalizing(editor, () => {
    const [node, nodePath] = Editor.node(editor, path)

    if (SlateElement.isElement(node) && arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, node.type)) {
      if (node.type === "head") {
        // 找到当前标题后同级且标题级别高于等于当前标题的标题节点
        const afterHeads = Array.from(
          Editor.nodes(editor, {
            at: nodePath.slice(0, -1),
            match: (n, p) =>
              SlateElement.isElement(n) &&
              n.type === "head" &&
              parseInt(n.headGrade) <= parseInt(node.headGrade) &&
              p.length === nodePath.length &&
              Path.isAfter(p, nodePath),
          })
          // 排序, 以在之后拿到最近的一个标题节点
        ).sort(([nodeA, pathA], [nodeB, pathB]) => (Path.isBefore(pathA, pathB) ? -1 : 1)) as NodeEntry<IHead>[]

        if (action === "toggle") {
          Transforms.setNodes(
            editor,
            {
              isFold: true,
            },
            {
              at: nodePath,
            }
          )
          Transforms.setNodes(
            editor,
            {
              collapsed: true,
            },
            {
              at: nodePath.slice(0, -1),
              match: (n, p) =>
                SlateElement.isElement(n) &&
                arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
                p.length === nodePath.length &&
                Path.isAfter(p, nodePath) &&
                (afterHeads.length === 0 || Path.isBefore(p, afterHeads[0][1])),
            }
          )
        } else {
          Transforms.unsetNodes(editor, ["isFold"], {
            at: nodePath,
          })
          Transforms.unsetNodes(editor, ["collapsed"], {
            at: nodePath.slice(0, -1),
            match: (n, p) =>
              SlateElement.isElement(n) &&
              arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
              p.length === nodePath.length &&
              Path.isAfter(p, nodePath) &&
              (afterHeads.length === 0 || Path.isBefore(p, afterHeads[0][1])),
          })
        }
      } else {
        if ((node as Exclude<BlockElementExceptTextLine, IHead>).children.length > 1) {
          if (action === "toggle") {
            Transforms.setNodes(
              editor,
              {
                collapsed: true,
              },
              {
                at: nodePath.concat([1]),
                match: (n, p) =>
                  SlateElement.isElement(n) &&
                  arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
                  p.length === nodePath.length + 2,
              }
            )
          } else {
            Transforms.unsetNodes(editor, ["collapsed"], {
              at: nodePath.concat([1]),
              match: (n, p) =>
                SlateElement.isElement(n) &&
                arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, n.type) &&
                p.length === nodePath.length + 2,
            })
          }
        }
      }
    }
  })
}

/**
 * 折叠节点的函数
 *
 * @param editor 编辑器实例
 * @param path 块级节点的 Path
 *
 */
export const toggleFold = (editor: Editor, path: Path): void => {
  handleFold(editor, path, "toggle")
}

/**
 * 取消节点折叠的函数
 *
 * @param editor 编辑器实例
 * @param path 块级节点的 Path
 *
 */
export const unToggleFold = (editor: Editor, path: Path): void => {
  handleFold(editor, path, "unToggle")
}
