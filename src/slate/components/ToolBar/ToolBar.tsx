import { useAtomValue } from "jotai"
import type React from "react"
import { isMouseUpAtom } from "../../state/mouse"
import { toolBar, toolBarContainer } from "./ToolBar.css"
import BoldButton from "./components/Bold/BoldButton"
import StrikeButton from "./components/Strike/StrikeButton"
import InlineCodeButton from "./components/InlineCode/InlineCodeButton"
import BlockCodeButton from "./components/BlockCode/BlockCodeButton"
import ColorButton from "./components/Color/ColorButton"

//TODO: item 可控拖拽
//TODO: need ReactEditor.focus(editor)?
const ToolBar: React.FC = () => {
  const isMouseUp = useAtomValue(isMouseUpAtom)

  const nativeSelection = window.getSelection()
  const isToolBarActive = !!(isMouseUp && nativeSelection && !nativeSelection.isCollapsed)

  if (isToolBarActive) {
    const selectedRange = nativeSelection.getRangeAt(0)

    const topDistance = window.scrollY + selectedRange.getBoundingClientRect().top
    const leftDistance = window.scrollX + selectedRange.getBoundingClientRect().left

    const toolBarStyle: React.CSSProperties = {
      transform: `${topDistance > 80 ? "translate3d(0, -10px, 0px)" : "translate3d(0, 10px, 0px)"} `,
      opacity: "1",
      transitionProperty: "opacity, transform",
      transitionDuration: "0.3s, 0.3s",
      transitionDelay: "0.017s, 0.017s",
      top: `${topDistance > 80 ? topDistance - 40 : topDistance + 20}px`,
      left: `${leftDistance}px`,
      userSelect: "none",
    }

    return (
      <div className={toolBarContainer} style={toolBarStyle}>
        <div style={{ display: "inline-block" }}>
          <ul className={toolBar}>
            <BoldButton></BoldButton>
            <StrikeButton></StrikeButton>
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
