import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IQuote } from "./types"

//TODO: 提取样式
const Quote: React.FC<CustomRenderElementProps<IQuote>> = ({ attributes, children, element }) => {
  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
        paddingLeft: "14px",
        position: "relative",
        color: "#ebebeb",
      }}
    >
      <div
        style={{
          height: "100%",
          position: "absolute",
          borderLeft: "2px solid #5f5f5f",
          borderRadius: "1px",
          left: "0px",
        }}
      ></div>
      {children}
    </div>
  )
}

export default Quote
