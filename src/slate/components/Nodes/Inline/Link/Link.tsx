import type { CustomRenderElementProps } from "../../../../types/utils"
import { linkContainer } from "./Link.css"
import type { ILink } from "./types"

const Link: React.FC<CustomRenderElementProps<ILink>> = ({ attributes, children, element }) => {
  return (
    <span {...attributes}>
      <a href={element.url} className={linkContainer}>
        {children}
      </a>
    </span>
  )
}

export default Link
