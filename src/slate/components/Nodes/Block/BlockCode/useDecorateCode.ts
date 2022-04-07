import Prism from "prismjs"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-dart"
import "prismjs/components/prism-docker"
import "prismjs/components/prism-git"
import "prismjs/components/prism-go"
import "prismjs/components/prism-graphql"
import "prismjs/components/prism-haskell"
import "prismjs/components/prism-http"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-java"
import "prismjs/components/prism-json"
import "prismjs/components/prism-latex"
import "prismjs/components/prism-perl"
import "prismjs/components/prism-php"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-plsql" // sql要在plsql前面
import "prismjs/components/prism-wasm"

import type { NodeEntry } from "slate"
import { useSlate } from "slate-react"
import { type SlateRange, SlateText, SlateNode, SlateElement } from "../../../../types/slate"
import { codeAreaLangMap } from "./constant"
import type { CustomText } from "../../../../types/interface"

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
