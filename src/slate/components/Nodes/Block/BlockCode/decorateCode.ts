import Prism from "prismjs"
import type { NodeEntry } from "slate"
import { useSlate } from "slate-react"
import type { CustomText } from "../../../../types/interface"
import { type SlateRange, SlateText, SlateNode, SlateElement } from "../../../../types/slate"
import { codeAreaLangMap } from "./constant"

const getTokenLength: (token: string | Prism.Token) => number = (token) => {
  if (typeof token === "string") {
    return token.length
  } else if (typeof token.content === "string") {
    return token.content.length
  } else {
    return (token.content as Array<string | Prism.Token>).reduce((l, t) => l + getTokenLength(t), 0)
  }
}

export const useDecorateCode = () => {
  const editor = useSlate()

  const decorateCode = (entry: NodeEntry) => {
    const [node, path] = entry
    const ranges: (SlateRange & {
      tokenTypes: CustomText["tokenTypes"]
    })[] = []

    if (SlateText.isText(node)) {
      const parentNode = SlateNode.parent(editor, path.slice(0, -1))

      if (SlateElement.isElement(parentNode) && parentNode.type === "blockCode_codeArea") {
        const lang = codeAreaLangMap[parentNode.lang]

        if (lang !== "plainText") {
          const tokens = Prism.tokenize(node.text, Prism.languages[lang])

          let start = 0
          for (const token of tokens) {
            const length = getTokenLength(token)
            const end = start + length

            if (typeof token !== "string") {
              // slate-react 会将 Point 以外的属性分配到对应的 leaf 中
              ranges.push({
                tokenTypes: {
                  [token.type]: true,
                },
                anchor: { path, offset: start },
                focus: { path, offset: end },
              })
            }

            start = end
          }
        }
      }
    }

    return ranges
  }

  return decorateCode
}
