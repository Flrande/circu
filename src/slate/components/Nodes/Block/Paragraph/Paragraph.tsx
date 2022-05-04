import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children, element }) => {
  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      <div
        style={{
          marginLeft: `${element.indentLevel * 22}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Paragraph
