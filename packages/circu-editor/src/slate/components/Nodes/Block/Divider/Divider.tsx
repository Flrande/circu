import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IDivider } from "./types"

const Divider: React.FC<CustomRenderElementProps<IDivider>> = ({ attributes, children }) => {
  return (
    <div contentEditable={false} {...attributes}>
      {children}
      <div className={"py-3"}>
        <div className={"h-[2px] bg-gray-700"}></div>
      </div>
    </div>
  )
}

export default Divider
