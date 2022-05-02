import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IUnorderedList } from "./types"

const UnorderedList: React.FC<CustomRenderElementProps<IUnorderedList>> = ({ attributes, children, element }) => {
  const indexSymbol = element.listLevel % 3 === 1 ? "\u2022" : element.listLevel % 3 === 2 ? "\u25E6" : "\u25AA"

  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          marginLeft: `${(element.listLevel - 1) * 22}px`,
          paddingLeft: "22px",
        }}
      >
        <span
          contentEditable={false}
          style={{
            position: "absolute",
            display: "inline-block",
            userSelect: "none",
            width: "22px",
            color: "#5a87f7",
            left: "0",
          }}
        >
          {indexSymbol}
        </span>
        {children}
      </div>
    </div>
  )
}

export default UnorderedList
