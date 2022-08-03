import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IInlineCode } from "./types"

// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span contentEditable={false} className={"select-none"}>
    {""}
  </span>
)

const InlineCode: React.FC<CustomRenderElementProps<IInlineCode>> = ({ attributes, children }) => {
  return (
    <span
      {...attributes}
      className={"border border-solid border-zinc-700 rounded-[4px] mx-[2px] px-1 font-normal tracking-wider"}
    >
      <InlineChromiumBugfix></InlineChromiumBugfix>
      {children}
      <InlineChromiumBugfix></InlineChromiumBugfix>
    </span>
  )
}

export default InlineCode
