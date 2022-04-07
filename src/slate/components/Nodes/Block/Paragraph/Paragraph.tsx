import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children }) => {
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
