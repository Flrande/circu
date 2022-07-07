import { useCallback } from "react"
import type { RenderElementProps, RenderLeafProps } from "slate-react"
import BlockCode from "../components/Nodes/Block/BlockCode/BlockCode"
import type { IBlockCode } from "../components/Nodes/Block/BlockCode/types"
import BlockChildren from "../components/Nodes/Block/BlockWrapper/BlockChildren"
import BlockContent from "../components/Nodes/Block/BlockWrapper/BlockContent"
import type { __IBlockElementChildren, __IBlockElementContent } from "../components/Nodes/Block/BlockWrapper/types"
import Head from "../components/Nodes/Block/Head/Head"
import type { IHead } from "../components/Nodes/Block/Head/types"
import OrderedList from "../components/Nodes/Block/List/OrderedList"
import type { IOrderedList, IUnorderedList } from "../components/Nodes/Block/List/types"
import UnorderedList from "../components/Nodes/Block/List/UnorderedList"
import Paragraph from "../components/Nodes/Block/Paragraph/Paragraph"
import type { IParagraph } from "../components/Nodes/Block/Paragraph/types"
import Quote from "../components/Nodes/Block/Quote/Quote"
import type { IQuote } from "../components/Nodes/Block/Quote/types"
import TextLine from "../components/Nodes/Block/TextLine/TextLine"
import type { ITextLine } from "../components/Nodes/Block/TextLine/types"
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
      case "__block-element-content":
        return <BlockContent {...(props as CustomRenderElementProps<__IBlockElementContent>)}></BlockContent>
      case "__block-element-children":
        return <BlockChildren {...(props as CustomRenderElementProps<__IBlockElementChildren>)}></BlockChildren>
      case "text-line":
        return <TextLine {...(props as CustomRenderElementProps<ITextLine>)}></TextLine>
      case "paragraph":
        return <Paragraph {...(props as CustomRenderElementProps<IParagraph>)}></Paragraph>
      case "block-code":
        return <BlockCode {...(props as CustomRenderElementProps<IBlockCode>)}></BlockCode>
      case "inline-code":
        return <InlineCode {...(props as CustomRenderElementProps<IInlineCode>)}></InlineCode>
      case "link":
        return <Link {...(props as CustomRenderElementProps<ILink>)}></Link>
      case "ordered-list":
        return <OrderedList {...(props as CustomRenderElementProps<IOrderedList>)}></OrderedList>
      case "unordered-list":
        return <UnorderedList {...(props as CustomRenderElementProps<IUnorderedList>)}></UnorderedList>
      case "head":
        return <Head {...(props as CustomRenderElementProps<IHead>)}></Head>
      case "quote":
        return <Quote {...(props as CustomRenderElementProps<IQuote>)}></Quote>
    }
  }, [])
}
