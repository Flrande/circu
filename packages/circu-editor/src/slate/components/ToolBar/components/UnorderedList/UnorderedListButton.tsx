import { ReactEditor, useSlateStatic } from "slate-react"
import { isListActive, toggleUnorderedList } from "../../../Nodes/Block/List/listHelper"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import UnorderedListIcon from "./UnorderedListIcon"

const UnorderedListButton: React.FC = () => {
  const editor = useSlateStatic()
  const isActive = isListActive(editor, "unordered-list")
  const onClick = () => {
    if (editor.selection) {
      toggleUnorderedList(editor)
    }
    ReactEditor.focus(editor)
  }

  return (
    <ToolBarItem
      styleMessage={"无序列表"}
      shortcutMessage={"Markdown: - 空格"}
      isStyleActive={isActive}
      onClick={onClick}
    >
      <UnorderedListIcon></UnorderedListIcon>
    </ToolBarItem>
  )
}

export default UnorderedListButton
