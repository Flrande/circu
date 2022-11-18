import { useAtom } from "jotai"
import { useDrop } from "react-dnd"
import { Editor, Path, Transforms } from "slate"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import { mouseXStateStore } from "../../state/mouse"
import { BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, BLOCK_ELEMENTS_WITH_CHILDREN } from "../../types/constant"
import type { BlockElementExceptTextLine, BlockElementWithChildren } from "../../types/interface"
import { SlateElement } from "../../types/slate"
import { arrayIncludes } from "../../utils/general"
import type { IQuote } from "../Nodes/Block/Quote/types"
import { mergeRefs } from "../Nodes/Block/utils/mergeRefs"
import { DND_ITEM_TYPES } from "./constant"
import { dropPositionAtom } from "./state"

export const useDropBlock = (
  element: Exclude<BlockElementExceptTextLine, IQuote>,
  attributes: RenderElementProps["attributes"]
): {
  newAttributes: Omit<RenderElementProps["attributes"], "ref"> & { ref: React.LegacyRef<any> }
  onDragOver: React.DragEventHandler
  dragActiveLine: "top" | "bottom" | null
} => {
  const editor = useSlateStatic()
  const [dropPosition, setDropPosition] = useAtom(dropPositionAtom)

  const [, dropRef] = useDrop(
    () => ({
      accept: DND_ITEM_TYPES.DRAGGABLE,
      drop: (_, monitor) => {
        if (dropPosition && mouseXStateStore.xBlockPath && !monitor.didDrop()) {
          const xBlockPath = mouseXStateStore.xBlockPath
          Editor.withoutNormalizing(editor, () => {
            const { path, direction } = dropPosition

            if (Path.equals(xBlockPath, path)) {
              return
            }

            if (Path.isBefore(xBlockPath, path)) {
              if (Path.isSibling(xBlockPath, path)) {
                if (direction === "top") {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: Path.previous(path),
                  })
                } else {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: path,
                  })
                }
              } else {
                if (direction === "top") {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: path,
                  })
                } else {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: Path.next(path),
                  })
                }
              }
            } else {
              if (Path.isSibling(xBlockPath, path)) {
                if (direction === "top") {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: path,
                  })
                } else {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: Path.next(path),
                  })
                }
              } else {
                if (direction === "top") {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: path,
                  })
                } else {
                  Transforms.moveNodes(editor, {
                    at: xBlockPath,
                    to: Path.next(path),
                  })
                }
              }
            }

            // 判断 xBlockPath 是否是父块级节点唯一子节点, 若是, 删除该子节点块
            if (xBlockPath.length >= 3) {
              const parentBlockPath = xBlockPath.slice(0, -2)

              const [parentNode] = Editor.node(editor, parentBlockPath)
              if (
                SlateElement.isElement(parentNode) &&
                arrayIncludes(BLOCK_ELEMENTS_WITH_CHILDREN, parentNode.type) &&
                (parentNode as BlockElementWithChildren).children.length > 1 &&
                (parentNode as BlockElementWithChildren).children[1]?.children.length === 0
              ) {
                Transforms.removeNodes(editor, {
                  at: parentBlockPath.concat([1]),
                })
              }
            }
          })
        }
      },
    }),
    [element, dropPosition]
  )

  const onDragOver: React.DragEventHandler = (event) => {
    try {
      const elements = document.elementsFromPoint(event.clientX, event.clientY)
      const blockDom = elements.find(
        (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block"
      )

      let path: Path | null = null

      if (blockDom) {
        const blockNode = ReactEditor.toSlateNode(editor, blockDom)

        if (
          SlateElement.isElement(blockNode) &&
          arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, blockNode.type) &&
          blockNode.type !== "quote"
        ) {
          path = ReactEditor.findPath(editor, blockNode)
        }
      }

      const spaceDom = elements.find(
        (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block-space"
      )
      if (spaceDom && spaceDom.parentElement) {
        const blockNode = ReactEditor.toSlateNode(editor, spaceDom.parentElement)

        if (
          SlateElement.isElement(blockNode) &&
          arrayIncludes(BLOCK_ELEMENTS_EXCEPT_TEXT_LINE, blockNode.type) &&
          blockNode.type !== "quote"
        ) {
          path = ReactEditor.findPath(editor, blockNode)
        }
      }

      if (path) {
        const [node] = Editor.node(editor, path)
        const dom = ReactEditor.toDOMNode(editor, node)
        const rect = dom.getBoundingClientRect()

        if (event.clientY - rect.height / 2 - rect.top > 0) {
          setDropPosition({
            path,
            direction: "bottom",
          })
        } else {
          setDropPosition({
            path,
            direction: "top",
          })
        }
      }
    } catch (error) {}
  }

  const newAttributes = { ...attributes, ref: mergeRefs([attributes.ref, dropRef]) }

  let dragActiveLine = null
  try {
    const path = ReactEditor.findPath(editor, element)

    if (dropPosition && Path.equals(path, dropPosition.path)) {
      dragActiveLine = dropPosition.direction
    }
  } catch (error) {}

  return {
    newAttributes,
    onDragOver,
    dragActiveLine,
  }
}
