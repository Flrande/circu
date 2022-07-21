import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IQuote } from "./types"

const Quote: React.FC<CustomRenderElementProps<IQuote>> = ({ attributes, children, element }) => {
  return (
    <div
      {...attributes}
      className={"my-2 pl-[14px] relative text-zinc-400"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div className={"h-full absolute border-l-2 border-solid border-zinc-500 rounded-[1px] left-0"}></div>
      {children}
    </div>
  )
}

export default Quote
