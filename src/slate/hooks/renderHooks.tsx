import type { RenderElementProps, RenderLeafProps } from "slate-react"
import BlockCode from "../components/Nodes/Block/BlockCode/BlockCode"
import BlockCode_CodeArea from "../components/Nodes/Block/BlockCode/BlockCode_CodeArea"
import type {
  BlockCodeType,
  BlockCode_CodeAreaType,
  BlockCode_VoidAreaType,
} from "../components/Nodes/Block/BlockCode/types"
import BlockCode_VoidArea from "../components/Nodes/Block/BlockCode/BlockCode_VoidArea"
import Paragraph from "../components/Nodes/Block/Paragraph/Paragraph"
import type { ParagraphType } from "../components/Nodes/Block/Paragraph/types"
import InlineCode from "../components/Nodes/Inline/InlineCode/InlineCode"
import type { InlineCodeType } from "../components/Nodes/Inline/InlineCode/types"
import Leaf from "../components/Nodes/Text/Leaf"
import type { CustomRenderElementProps } from "../types/utils"

export const useRenderLeaf = () => {
  return (props: RenderLeafProps) => <Leaf {...props}></Leaf>
}

export const useRenderElement = () => {
  return (props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <Paragraph {...(props as CustomRenderElementProps<ParagraphType>)}></Paragraph>
      case "blockCode":
        return <BlockCode {...(props as CustomRenderElementProps<BlockCodeType>)}></BlockCode>
      case "inlineCode":
        return <InlineCode {...(props as CustomRenderElementProps<InlineCodeType>)}></InlineCode>
      case "blockCode_codeArea":
        return (
          <BlockCode_CodeArea {...(props as CustomRenderElementProps<BlockCode_CodeAreaType>)}></BlockCode_CodeArea>
        )
      case "blockCode_voidArea":
        return (
          <BlockCode_VoidArea {...(props as CustomRenderElementProps<BlockCode_VoidAreaType>)}></BlockCode_VoidArea>
        )
    }
  }
}
