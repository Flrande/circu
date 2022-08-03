import type { CustomRenderElementProps } from "../../../../types/utils"
import type { ITitle } from "./types"

const Title: React.FC<CustomRenderElementProps<ITitle>> = ({ attributes, children }) => {
  return (
    <div {...attributes} className={"text-5xl mt-14 mb-5"}>
      {children}
    </div>
  )
}

export default Title
