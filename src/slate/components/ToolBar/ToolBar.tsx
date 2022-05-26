import { useAtomValue } from "jotai"
import type React from "react"
import { toolBar, toolBarContainer } from "./ToolBar.css"
import BoldButton from "./components/Bold/BoldButton"
import StrikeButton from "./components/Strike/StrikeButton"
import InlineCodeButton from "./components/InlineCode/InlineCodeButton"
import BlockCodeButton from "./components/BlockCode/BlockCodeButton"
import ColorButton from "./components/Color/ColorButton"
import ItalicButton from "./components/Italic/ItalicButton"
import { toolBarStateAtom } from "./state"
import LinkButton from "./components/Link/LinkButton"
import OrderedListButton from "./components/OrderedList/OrderedListButton"
import UnorderedListButton from "./components/UnorderedList/UnorderedListButton"
import HeadButton from "./components/Head/HeadButton"
import UnderlineButton from "./components/Underline/UnderlineButton"
import QuoteButton from "./components/Quote/QuoteButton"

//TODO: item 可控拖拽
const ToolBar: React.FC = () => {
  const toolBarState = useAtomValue(toolBarStateAtom)

  const isActive = toolBarState.isActive
  const position = toolBarState.position

  if (isActive && position) {
    const toolBarStyle: React.CSSProperties = {
      transform: `translate3d(0, ${position.translateY}px, 0px)`,
      opacity: "1",
      transitionProperty: "opacity, transform",
      transitionDuration: "0.3s, 0.3s",
      transitionDelay: "0.017s, 0.017s",
      top: `${position.y}px`,
      left: `${position.x}px`,
      // 防止产生 selectstart 事件往上冒泡, 进而导致 ToolBar 不显示
      userSelect: "none",
    }

    return (
      <div className={toolBarContainer} style={toolBarStyle}>
        <ul className={toolBar}>
          <HeadButton headGrade={"1"}></HeadButton>
          <HeadButton headGrade={"2"}></HeadButton>
          <HeadButton headGrade={"3"}></HeadButton>
          <HeadButton headGrade={"no-grade"}></HeadButton>
          <BoldButton></BoldButton>
          <StrikeButton></StrikeButton>
          <UnderlineButton></UnderlineButton>
          <ItalicButton></ItalicButton>
          <ColorButton></ColorButton>
          <QuoteButton></QuoteButton>
          <LinkButton></LinkButton>
          <OrderedListButton></OrderedListButton>
          <UnorderedListButton></UnorderedListButton>
          <InlineCodeButton></InlineCodeButton>
          <BlockCodeButton></BlockCodeButton>
        </ul>
      </div>
    )
  } else {
    return <div style={{ opacity: "0" }}></div>
  }
}

export default ToolBar
