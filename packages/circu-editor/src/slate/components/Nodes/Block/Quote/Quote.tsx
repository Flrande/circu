import type { CustomRenderElementProps } from "../../../../types/utils"
import { quoteContainer, quoteYLine } from "./Quote.css"
import type { IQuote } from "./types"

const Quote: React.FC<CustomRenderElementProps<IQuote>> = ({ attributes, children, element }) => {
  return (
    <div
      {...attributes}
      className={quoteContainer}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div className={quoteYLine}></div>
      {children}
    </div>
  )
}

export default Quote
