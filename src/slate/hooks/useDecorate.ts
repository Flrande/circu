import type { NodeEntry } from "slate"
import { useSlate } from "slate-react"
import { decorateCode } from "../components/Nodes/Block/BlockCode/decorateCode"
import type { CustomText } from "../types/interface"
import type { SlateRange } from "../types/slate"

export const useDecorate = () => {
  const editor = useSlate()

  const decorate = (entry: NodeEntry) => {
    let ranges: (SlateRange & {
      tokenTypes: CustomText["tokenTypes"]
    })[] = []

    ranges = ranges.concat(decorateCode(editor, entry))

    return ranges
  }

  return decorate
}
