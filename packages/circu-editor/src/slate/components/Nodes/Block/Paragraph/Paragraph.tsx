import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IParagraph } from "./types"

const Paragraph: React.FC<CustomRenderElementProps<IParagraph>> = ({ attributes, children, element }) => {
  return (
    <div
      data-circu-node="block"
      {...attributes}
      className={"my-2 relative"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div data-circu-node="block-space" contentEditable={false} className={"absolute left-0 -top-2 w-full h-2"}></div>
      <div>{children}</div>
    </div>
  )
}

export default Paragraph
