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

import { Editor, NodeEntry } from "slate"
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

/**
 * 用于在代码块中生成高亮的函数
 *
 * @param editor 编辑器实例
 * @param entry decorate 所用的 entry
 * @returns 生成的高亮 range
 *
 */
export const decorateCode = (editor: Editor, entry: NodeEntry) => {
  const [node, path] = entry
  const ranges: (SlateRange & {
    tokenTypes: CustomText["tokenTypes"]
  })[] = []

  if (SlateElement.isElement(node) && node.type === "block-code") {
    const lang = codeAreaLangMap[node.langKey]
    if (lang !== "plainText") {
      const codeLines = node.children[0].children

      const tmpPath = path.concat([0])
      for (const [index, codeLine] of codeLines.entries()) {
        // 计算当前 codeLine 的 path
        const currentLinePath = tmpPath.concat([index])

        const string = SlateNode.string(codeLine)
        const tokens = Prism.tokenize(string, Prism.languages[lang])

        // string 中 token 的 offset (附加 token 类型)
        // 如对 const tmp = 1 tokenize 后 -> [[0, 5, ...], [10, 11, ...], [12, 13, ...]] (Javascript)
        let splitOffset: Array<[number, number, string]> = []
        let start = 0
        for (const token of tokens) {
          const length = getTokenLength(token)
          const end = start + length

          if (typeof token !== "string") {
            splitOffset.push([start, end, token.type]) // 附加 token 类型
          }

          start = end
        }

        // 当前 codeLine 下的所有 Text
        const textEntryArr = Array.from(
          Editor.nodes(editor, {
            at: currentLinePath,
            match: (n) => SlateText.isText(n),
          })
        ) as NodeEntry<CustomText>[]

        // 遍历每个 token, 找到每个 token 对应的所有 Range
        for (const tokenOffset of splitOffset) {
          const [start, end, tokenType] = tokenOffset
          // 当前到达的 Point offset (以 Text 为单位进行跳跃, 这个 offset 相对于整个 node 的 string)
          let currentOffset = 0
          for (const [node, path] of textEntryArr) {
            // 无视 { text: "" }
            if (node.text.length === 0) continue

            const newCurrentOffset = currentOffset + node.text.length
            if (newCurrentOffset > start && newCurrentOffset >= end) {
              ranges.push({
                tokenTypes: {
                  [tokenType]: true,
                },
                anchor: {
                  path,
                  offset: start - currentOffset < 0 ? 0 : start - currentOffset,
                },
                focus: {
                  path,
                  offset: end - currentOffset,
                },
              })
            }
            if (newCurrentOffset > start && newCurrentOffset < end) {
              ranges.push({
                tokenTypes: {
                  [tokenType]: true,
                },
                anchor: {
                  path,
                  offset: start - currentOffset,
                },
                focus: {
                  path,
                  offset: node.text.length,
                },
              })
            }
            currentOffset = newCurrentOffset
          }
        }
      }
    }
  }

  return ranges
}
