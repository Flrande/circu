export interface InlineCodeProps {
  attributes: { [key: string]: any }
}

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

const InlineCode: React.FC<InlineCodeProps> = ({ attributes, children }) => {
  return (
    <span
      {...attributes}
      style={{
        border: "1px solid #464646",
        borderRadius: "4px",
        margin: "0 2px 0 2px",
        padding: "0 2px 0 2px",
        fontWeight: "400",
      }}
    >
      <InlineChromiumBugfix></InlineChromiumBugfix>
      {children}
      <InlineChromiumBugfix></InlineChromiumBugfix>
    </span>
  )
}

export default InlineCode
