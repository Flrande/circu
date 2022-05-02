import { Editor, NodeEntry, Transforms } from "slate"
import { PARAGRAPH_TYPE_ELEMENTS } from "../../../../types/constant"
import type { ParagraphTypeElement } from "../../../../types/interface"
import { SlateElement, SlateRange } from "../../../../types/slate"
import { arrayIncludes } from "../../../../utils/general"

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
    const [selectedList] = selectedParagraphEntryArr[0]

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
