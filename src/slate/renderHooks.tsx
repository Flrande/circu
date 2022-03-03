import type { RenderElementProps, RenderLeafProps } from "slate-react"
import ParagraphElement from "./components/Block/Paragraph/ParagraphElement"
import InlineCodeElement from "./components/Inline/InlineCode/InlineCodeElement"
import Leaf from "./components/Text/Leaf"

export const useRenderLeaf = () => {
  return (props: RenderLeafProps) => <Leaf {...props}></Leaf>
}

export const useRenderElement = () => {
  return (props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <ParagraphElement {...props}></ParagraphElement>
      case "inlineCode":
        return <InlineCodeElement {...props}></InlineCodeElement>
    }
  }
}
