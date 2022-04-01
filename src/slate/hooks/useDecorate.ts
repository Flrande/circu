import type Prism from "prismjs"
import type { NodeEntry } from "slate"
import { useDecorateCode } from "../components/Nodes/Block/BlockCode/useDecorateCode"
import type { CustomText } from "../types/interface"
import type { SlateRange } from "../types/slate"

const getTokenLength: (token: string | Prism.Token) => number = (token) => {
  if (typeof token === "string") {
    return token.length
  } else if (typeof token.content === "string") {
    return token.content.length
  } else {
    return (token.content as Array<string | Prism.Token>).reduce((l, t) => l + getTokenLength(t), 0)
  }
}

export const useDecorate = () => {
  const decorateCode = useDecorateCode()
  const decorate = (entry: NodeEntry) => {
    let ranges: (SlateRange & {
      tokenTypes: CustomText["tokenTypes"]
    })[] = []

    ranges = ranges.concat(decorateCode(entry))

    return ranges
  }

  return decorate
}
