import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IHead } from "./types"

const Head: React.FC<CustomRenderElementProps<IHead>> = ({ attributes, children, element }) => {
  switch (element.headGrade) {
    case "1":
      return (
        <div
          {...attributes}
          style={{
            display: element.isHidden ? "none" : undefined,
          }}
          className={"head-1"}
        >
          {children}
        </div>
      )
    case "2":
      return (
        <div
          {...attributes}
          style={{
            display: element.isHidden ? "none" : undefined,
          }}
          className={"head-2"}
        >
          {children}
        </div>
      )
    case "3":
      return (
        <div
          {...attributes}
          style={{
            display: element.isHidden ? "none" : undefined,
          }}
          className={"head-3"}
        >
          {children}
        </div>
      )
    case "4":
      return (
        <div
          {...attributes}
          style={{
            display: element.isHidden ? "none" : undefined,
          }}
          className={"head-4"}
        >
          {children}
        </div>
      )
    case "5":
      return (
        <div
          {...attributes}
          style={{
            display: element.isHidden ? "none" : undefined,
          }}
          className={"head-5"}
        >
          {children}
        </div>
      )
    case "6":
      return (
        <div
          {...attributes}
          style={{
            display: element.isHidden ? "none" : undefined,
          }}
          className={"head-6"}
        >
          {children}
        </div>
      )
  }
}

export default Head
