import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type IParagraph = {
  type: "paragraph"
  isFolded?: true
  isHidden?: true
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}

export const EMPTY_PARAGRAPH_FACTORY: () => IParagraph = () =>
  Object.assign(
    {},
    {
      type: "paragraph",
      children: [
        {
          type: "__block-element-content",
          children: [
            {
              type: "text-line",
              children: [
                {
                  text: "",
                },
              ],
            },
          ],
        },
      ],
    }
  ) as IParagraph
