import { useCallback } from "react"
import type { RenderElementProps, RenderLeafProps } from "slate-react"
import BlockCode from "../components/Nodes/Block/BlockCode/BlockCode"
import BlockCode_CodeArea from "../components/Nodes/Block/BlockCode/BlockCode_CodeArea"
import BlockCode_CodeLine from "../components/Nodes/Block/BlockCode/BlockCode_CodeLine"
import BlockCode_VoidArea from "../components/Nodes/Block/BlockCode/BlockCode_VoidArea"
import type {
  IBlockCode,
  IBlockCode_CodeArea,
  IBlockCode_CodeLine,
  IBlockCode_VoidArea,
} from "../components/Nodes/Block/BlockCode/types"
import Head from "../components/Nodes/Block/Head/Head"
import type { IHead } from "../components/Nodes/Block/Head/types"
import OrderedList from "../components/Nodes/Block/List/OrderedList"
import type { IOrderedList, IUnorderedList } from "../components/Nodes/Block/List/types"
import UnorderedList from "../components/Nodes/Block/List/UnorderedList"
import Paragraph from "../components/Nodes/Block/Paragraph/Paragraph"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import InlineCode from "../components/Nodes/Inline/InlineCode/InlineCode"
import type { IInlineCode } from "../components/Nodes/Inline/InlineCode/types"
import Link from "../components/Nodes/Inline/Link/Link"
import type { ILink } from "../components/Nodes/Inline/Link/types"
import Leaf from "../components/Nodes/Text/Leaf"
import type { CustomRenderElementProps } from "../types/utils"

export const useRenderLeaf = () => {
  return useCallback((props: RenderLeafProps) => <Leaf {...props}></Leaf>, [])
}

export const useRenderElement = () => {
  return useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <Paragraph {...(props as CustomRenderElementProps<IParagraph>)}></Paragraph>
      case "blockCode":
        return <BlockCode {...(props as CustomRenderElementProps<IBlockCode>)}></BlockCode>
      case "blockCode_codeArea":
        return <BlockCode_CodeArea {...(props as CustomRenderElementProps<IBlockCode_CodeArea>)}></BlockCode_CodeArea>
      case "blockCode_voidArea":
        return <BlockCode_VoidArea {...(props as CustomRenderElementProps<IBlockCode_VoidArea>)}></BlockCode_VoidArea>
      case "blockCode_codeLine":
        return <BlockCode_CodeLine {...(props as CustomRenderElementProps<IBlockCode_CodeLine>)}></BlockCode_CodeLine>
      case "inlineCode":
        return <InlineCode {...(props as CustomRenderElementProps<IInlineCode>)}></InlineCode>
      case "link":
        return <Link {...(props as CustomRenderElementProps<ILink>)}></Link>
      case "orderedList":
        return <OrderedList {...(props as CustomRenderElementProps<IOrderedList>)}></OrderedList>
      case "unorderedList":
        return <UnorderedList {...(props as CustomRenderElementProps<IUnorderedList>)}></UnorderedList>
      case "head":
        return <Head {...(props as CustomRenderElementProps<IHead>)}></Head>
    }
  }, [])
}
