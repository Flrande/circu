import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children, element }) => {
  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div>{children}</div>
    </div>
  )
}

export default Paragraph
