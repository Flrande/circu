import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IUnorderedList } from "./types"

const UnorderedList: React.FC<CustomRenderElementProps<IUnorderedList>> = ({ attributes, children, element }) => {
  if (element.indexState !== "noIndex") {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
        }}
      >
        <span
          contentEditable={false}
          style={{
            display: "inline-block",
            userSelect: "none",
            width: "22px",
            color: "#5a87f7",
          }}
        >
          {"\u2022"}
        </span>
        {children}
      </div>
    )
  } else {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
          paddingLeft: "22px",
        }}
      >
        {children}
      </div>
    )
  }
}

export default UnorderedList
