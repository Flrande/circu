import { useCallback } from "react"
import type { NodeEntry } from "slate"
import { useSlateStatic } from "slate-react"
import { decorateCode } from "../components/Nodes/Block/BlockCode/decorateCode"
import type { CustomText } from "../types/interface"
import type { SlateRange } from "../types/slate"

export const useDecorate = () => {
  const editor = useSlateStatic()

  return useCallback((entry: NodeEntry) => {
    let ranges: (SlateRange & {
      tokenTypes: CustomText["tokenTypes"]
    })[] = []

    ranges = ranges.concat(decorateCode(editor, entry))

    return ranges
  }, [])
}
