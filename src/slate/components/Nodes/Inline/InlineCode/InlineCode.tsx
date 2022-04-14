import type { CustomRenderElementProps } from "../../../../types/utils"
import { inlineCodeContainer } from "./InlineCode.css"
import type { IInlineCode } from "./types"

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    style={{
      fontSize: "0",
    }}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const InlineCode: React.FC<CustomRenderElementProps<IInlineCode>> = ({ attributes, children }) => {
  return (
    <span {...attributes} className={inlineCodeContainer}>
      <InlineChromiumBugfix></InlineChromiumBugfix>
      {children}
      <InlineChromiumBugfix></InlineChromiumBugfix>
    </span>
  )
}

export default InlineCode
