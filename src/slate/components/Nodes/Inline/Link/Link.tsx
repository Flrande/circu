import type { CustomRenderElementProps } from "../../../../types/utils"
import type { ILink } from "./types"

const Link: React.FC<CustomRenderElementProps<ILink>> = ({ attributes, children, element }) => {
  return (
    <span {...attributes}>
      <a
        href={element.url}
        style={{
          textDecoration: "none",
          cursor: "pointer",
          color: "#5a87d3",
        }}
      >
        {children}
      </a>
    </span>
  )
}

export default Link
