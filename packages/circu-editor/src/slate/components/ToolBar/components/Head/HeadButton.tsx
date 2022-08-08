import { useAtom } from "jotai"
import { useState } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { isHeadActive, toggleHead } from "../../../Nodes/Block/Head/headHelper"
import type { IHeadGrade } from "../../../Nodes/Block/Head/types"
import { activeButtonAtom } from "../../state"
import ToolBarItem from "../ToolBarItem/ToolBarItem"
import { useIconColor } from "../ToolBarItem/useIconColor"
import HeadButtonBar from "./HeadButtonBar"
import HeadIcon from "./HeadIcon"

const HeadButton: React.FC<{
  headGrade: IHeadGrade | "no-grade"
}> = ({ headGrade }) => {
  const [isMouseEnter, setIsMouseEnter] = useState(false)
  const { fillColor, backgroundColor } = useIconColor(false, isMouseEnter)
  const [activeButton, setActiveButton] = useAtom(activeButtonAtom)

  let styleMessage: string
  let shortcutMessage: string
  switch (headGrade) {
    case "1":
      styleMessage = "一级标题"
      shortcutMessage = "Markdown: # 空格"
      break
    case "2":
      styleMessage = "二级标题"
      shortcutMessage = "Markdown: ## 空格"
      break
    case "3":
      styleMessage = "三级标题"
      shortcutMessage = "Markdown: ### 空格"
      break
    case "4":
      styleMessage = "四级标题"
      shortcutMessage = "Markdown: #### 空格"
      break
    case "5":
      styleMessage = "五级标题"
      shortcutMessage = "Markdown: ##### 空格"
      break
    case "6":
      styleMessage = "六级标题"
      shortcutMessage = "Markdown: ###### 空格"
      break
    default:
      styleMessage = "一级标题"
      shortcutMessage = "Markdown: # 空格"
      break
  }

  if (headGrade === "no-grade") {
    // 大部分逻辑来自 ToolBarItem
    return (
      <div className={"py-2 px-1"}>
        <div
          onMouseEnter={() => {
            setIsMouseEnter(true)
            setActiveButton("head-bar")
          }}
          onMouseLeave={() => {
            setIsMouseEnter(false)
          }}
          className={"flex items-center justify-center h-8 w-8 rounded-md cursor-pointer"}
          style={{
            backgroundColor: backgroundColor,
            position: "relative",
            // 为了给箭头留出空间, 覆盖类中的样式
            justifyContent: "start",
            width: "32px",
          }}
        >
          <div
            className={"h-6 w-6"}
            style={{
              // 设计上这应该是离 icon svg 最近的一个 color,
              // 否则 svg 中的 currentColor 会导致颜色与预期不符
              color: fillColor,
            }}
          >
            <HeadButtonBar></HeadButtonBar>
            <HeadIcon headGrade={headGrade}></HeadIcon>
          </div>
          <svg
            className={"absolute left-5 top-[10px] w-3 h-3 transition-transform"}
            style={{
              transform: activeButton === "head-bar" ? "rotate(180deg)" : undefined,
            }}
            viewBox="0 0 12 12"
          >
            <path
              d="M6 6.69l2.65-2.65a.5.5 0 11.7.7L6 8.1 2.65 4.75a.5.5 0 11.7-.71L6 6.69z"
              fillRule="nonzero"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </div>
    )
  } else {
    const editor = useSlateStatic()
    const isActive = isHeadActive(editor, headGrade)

    const onClick = () => {
      toggleHead(editor, headGrade)
      ReactEditor.focus(editor)
    }

    const onMouseEnter = () => {
      if (headGrade === "1" || headGrade === "2" || headGrade === "3") {
        setActiveButton(headGrade === "1" ? "head-1" : headGrade === "2" ? "head-2" : "head-3")
      }
    }

    return (
      <ToolBarItem
        styleMessage={styleMessage}
        shortcutMessage={shortcutMessage}
        isStyleActive={isActive}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <HeadIcon headGrade={headGrade}></HeadIcon>
      </ToolBarItem>
    )
  }
}

export default HeadButton
