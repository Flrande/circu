import { Editor, NodeEntry, Transforms } from "slate"
import { PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateNode, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"
import type { IListLevel } from "./types"

/**
 * 处理有序列表中换行行为的函数, 不负责覆盖默认行为
 *
 * @param editor 当前编辑器实例
 *
 */
export const orderedListLineBreakHandler = (editor: Editor) => {
  // 选中的段落型元素
  const selectedParagraphEntryArr = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && arrayIncludes(PARAGRAPH_TYPE_ELEMENTS, n.type),
    })
  ) as NodeEntry<ParagraphTypeElement>[]

  // 判断是否为光标状态且选中元素为有序列表
  if (
    editor.selection &&
    SlateRange.isCollapsed(editor.selection) &&
    selectedParagraphEntryArr.length === 1 &&
    SlateElement.isElement(selectedParagraphEntryArr[0][0]) &&
    selectedParagraphEntryArr[0][0].type === "orderedList"
  ) {
    // 当前光标所在的有序列表
    const [selectedList, selectedListPath] = selectedParagraphEntryArr[0]

    // 若列表内容为空, 触发换行时进行缩进前移
    if (SlateNode.string(selectedList).length === 0) {
      if (selectedList.listLevel >= 2) {
        Transforms.setNodes(editor, {
          listLevel: (selectedList.listLevel - 1) as IListLevel,
        })
      } else {
        Transforms.removeNodes(editor, {
          at: selectedListPath,
        })
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            indentLevel: 0,
            children: [
              {
                text: "",
              },
            ],
          },
          {
            at: selectedListPath,
          }
        )
        Transforms.select(editor, Editor.start(editor, selectedListPath))
      }
      return
    }

    // 若当前有序列表为列表头, 换行后新产生的列表应为自增
    if (selectedList.indexState.type === "head") {
      Transforms.splitNodes(editor, { always: true })

      const newListPath = editor.selection.anchor.path.slice(0, 1)
      Transforms.setNodes(
        editor,
        {
          indexState: {
            type: "selfIncrement",
            index: 1,
          },
        },
        {
          at: newListPath,
        }
      )
      return
    }
  }
  // 默认行为
  Transforms.splitNodes(editor, { always: true })
}
