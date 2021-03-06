import type React from "react"
import { useCallback } from "react"
import type { RenderLeafProps } from "slate-react"
import type { CustomText } from "../../../types/interface"
import Bold from "./Bold"
import Color from "./Color"
import Italic from "./Italic"
import Strike from "./Strike"
import Underline from "./Underline"

const getTokenColor = (tokenTypes: CustomText["tokenTypes"]) => {
  let color: string | undefined = undefined

  if (tokenTypes) {
    if (tokenTypes.comment) {
      color = "slategray"
    } else if (tokenTypes.operator || tokenTypes.url) {
      color = "#9a6e3a"
    } else if (tokenTypes.keyword) {
      color = "#07a"
    } else if (tokenTypes.variable || tokenTypes.regex) {
      color = "#e90"
    } else if (
      tokenTypes.number ||
      tokenTypes.boolean ||
      tokenTypes.tag ||
      tokenTypes.constant ||
      tokenTypes.symbol ||
      tokenTypes["attr-name"] ||
      tokenTypes.selector
    ) {
      color = "#905"
    } else if (tokenTypes.punctuation) {
      color = "#999"
    } else if (tokenTypes.string || tokenTypes.char) {
      color = "#690"
    } else if (tokenTypes.function || tokenTypes["class-name"]) {
      color = "#dd4a68"
    } else {
    }
  }

  return color
}

const Leaf: React.FC<React.PropsWithChildren<RenderLeafProps>> = ({ attributes, children, leaf }) => {
  if (leaf.underline) {
    children = <Underline>{children}</Underline>
  }

  if (leaf.italic) {
    children = <Italic>{children}</Italic>
  }

  if (leaf.bold) {
    children = <Bold>{children}</Bold>
  }

  if (leaf.strike) {
    children = <Strike>{children}</Strike>
  }

  if (leaf.color) {
    children = (
      <Color fontColorKey={leaf.color.fontColorKey} backgroundColorKey={leaf.color.backgroundColorKey}>
        {children}
      </Color>
    )
  }

  return (
    // 用于解决行内元素在行尾(后面实际还有一个空的 text)时光标无法选择至 text 的问题
    <span
      {...attributes}
      onDragStart={useCallback<React.DragEventHandler>((event) => {
        event.preventDefault()
      }, [])}
      style={{ paddingLeft: leaf.text === "" ? "0.1px" : undefined, color: getTokenColor(leaf.tokenTypes) }}
    >
      {children}
    </span>
  )
}

export default Leaf
