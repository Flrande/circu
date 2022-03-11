import type { RenderElementProps, RenderLeafProps } from "slate-react"
import BlockCode from "./components/Nodes/Block/BlockCode/BlockCode"
import Paragraph from "./components/Nodes/Block/Paragraph/Paragraph"
import InlineCode from "./components/Nodes/Inline/InlineCode/InlineCode"
import Leaf from "./components/Nodes/Text/Leaf"

export const useRenderLeaf = () => {
  return (props: RenderLeafProps) => <Leaf {...props}></Leaf>
}

export const useRenderElement = () => {
  return (props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <Paragraph {...props}></Paragraph>
      case "blockCode":
        return <BlockCode {...props}></BlockCode>
      case "inlineCode":
        return <InlineCode {...props}></InlineCode>
    }
  }
}
