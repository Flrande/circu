import type { CustomRenderElementProps } from "../../../../types/utils"
import type { ParagraphType } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<ParagraphType>> = ({ attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      {children}
    </div>
  )
}

export default Paragraph
