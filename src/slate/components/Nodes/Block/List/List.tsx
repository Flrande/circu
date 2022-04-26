import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IList } from "./types"

const List: React.FC<CustomRenderElementProps<IList>> = ({ attributes, children, element }) => {
  if (element.listType === "ordered") {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
        }}
      >
        <span>{element.index}.</span>
        {children}
      </div>
    )
  } else {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
        }}
      >
        <span>.</span>
        {children}
      </div>
    )
  }
}

export default List
