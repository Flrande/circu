import { useSetAtom } from "jotai"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isQuoteActive, toggleQuote } from "../../../Nodes/Block/Quote/quoteHelper"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import QuoteIcon from "./QuoteIcon"

const QuoteButton: React.FC = () => {
  const editor = useSlateStatic()
  const setActiveButton = useSetAtom(activeButtonAtom)
  const isActive = isQuoteActive(editor)

  const onClick = () => {
    toggleQuote(editor)
    ReactEditor.focus(editor)
  }
  const onMouseEnter = () => {
    setActiveButton("quote")
  }

  return (
    <ToolBarItem styleMessage={"引用"} isStyleActive={isActive} onClick={onClick} onMouseEnter={onMouseEnter}>
      <QuoteIcon></QuoteIcon>
    </ToolBarItem>
  )
}

export default QuoteButton
