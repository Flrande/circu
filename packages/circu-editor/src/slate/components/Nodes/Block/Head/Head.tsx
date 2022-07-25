import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IHead } from "./types"

const Head: React.FC<CustomRenderElementProps<IHead>> = ({ attributes, children, element }) => {
  let className: "head-1" | "head-2" | "head-3" | "head-4" | "head-5" | "head-6"
  switch (element.headGrade) {
    case "1":
      className = "head-1"
      break
    case "2":
      className = "head-2"
      break
    case "3":
      className = "head-3"
      break
    case "4":
      className = "head-4"
      break
    case "5":
      className = "head-5"
      break
    case "6":
      className = "head-6"
      break
    default:
      className = "head-1"
  }

  return (
    <div
      data-circu-node="block"
      {...attributes}
      className={`${className} relative`}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div data-circu-node="block-space" contentEditable={false} className={"absolute left-0 w-full"}></div>
      {children}
    </div>
  )
}

export default Head
