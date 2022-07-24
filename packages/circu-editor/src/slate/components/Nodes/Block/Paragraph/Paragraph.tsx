import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children, element }) => {
  return (
    <div
      data-circu-node="block"
      {...attributes}
      className={"my-2"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div>{children}</div>
    </div>
  )
}

export default Paragraph
