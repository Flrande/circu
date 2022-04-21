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
      userSelect: "none",
    }

    return (
      <div className={toolBarContainer} style={toolBarStyle}>
        <div style={{ display: "inline-block" }}>
          <ul className={toolBar}>
            <BoldButton></BoldButton>
            <StrikeButton></StrikeButton>
            <ItalicButton></ItalicButton>
            <ColorButton></ColorButton>
            <InlineCodeButton></InlineCodeButton>
            <BlockCodeButton></BlockCodeButton>
          </ul>
        </div>
      </div>
    )
  } else {
    return <div style={{ opacity: "0" }}></div>
  }
}

export default ToolBar
