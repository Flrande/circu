import { ReactEditor, useSlate } from "slate-react"
import { toggleBlockCode } from "../Nodes/Block/BlockCode/blockCodeHelper"
import { toggleInlineCode } from "../Nodes/Inline/InlineCode/inlineCodeHelper"
import { toggleMark } from "../Nodes/Text/textHelper"

export const useToolBarHandlers = () => {
  const editor = useSlate()

  // 删除线
  const strikeHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "strike")
    ReactEditor.focus(editor)
  }

  // 粗体
  const boldHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMark(editor, "bold")
    ReactEditor.focus(editor)
  }

  // 行内代码
  const inlineCodeHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleInlineCode(editor)
      ReactEditor.focus(editor)
    }
  }

  // 代码块
  const blockCodeHandler = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (editor.selection) {
      toggleBlockCode(editor)
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      })
      window.getSelection()?.anchorNode?.parentElement?.dispatchEvent(event)
    }
  }

  return {
    strikeHandler,
    boldHandler,
    inlineCodeHandler,
    blockCodeHandler,
  }
}
