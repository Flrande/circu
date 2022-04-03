import type { NodeEntry } from "slate"
import { useDecorateCode } from "../components/Nodes/Block/BlockCode/useDecorateCode"
import type { CustomText } from "../types/interface"
import type { SlateRange } from "../types/slate"

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
