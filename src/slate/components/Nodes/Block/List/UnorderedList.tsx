import type { CustomRenderElementProps } from "../../../../types/utils"
import { unorderedListSymbol } from "./List.css"
import type { IUnorderedList } from "./types"

const UnorderedList: React.FC<CustomRenderElementProps<IUnorderedList>> = ({ attributes, children, element }) => {
  const indexSymbol = element.indentLevel % 3 === 1 ? "\u2022" : element.indentLevel % 3 === 2 ? "\u25E6" : "\u25AA"

  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      <div
        style={{
          marginLeft: `${(element.indentLevel - 1) * 22}px`,
          display: "flex",
        }}
      >
        <span contentEditable={false} className={unorderedListSymbol}>
          {indexSymbol}
        </span>
        <span
          style={{
            minWidth: "0",
          }}
        >
          {children}
        </span>
      </div>
    </div>
  )
}

export default UnorderedList
