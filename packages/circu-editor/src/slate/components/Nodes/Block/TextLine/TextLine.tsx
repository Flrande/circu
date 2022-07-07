import type { CustomRenderElementProps } from "../../../../types/utils"
import type { ITextLine } from "./types"

const TextLine: React.FC<CustomRenderElementProps<ITextLine>> = ({ attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{
        wordBreak: "break-all",
      }}
    >
      {children}
    </div>
  )
}

export default TextLine
