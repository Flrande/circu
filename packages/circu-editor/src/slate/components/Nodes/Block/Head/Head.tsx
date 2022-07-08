import type { CustomRenderElementProps } from "../../../../types/utils"
import { head_1, head_2, head_3, head_4, head_5, head_6 } from "./Head.css"
import type { IHead } from "./types"

const Head: React.FC<CustomRenderElementProps<IHead>> = ({ attributes, children, element }) => {
  switch (element.headGrade) {
    case "1":
      return (
        <div
          {...attributes}
          style={{
            display: element.collapsed ? "none" : undefined,
          }}
          className={head_1}
        >
          {children}
        </div>
      )
    case "2":
      return (
        <div
          {...attributes}
          style={{
            display: element.collapsed ? "none" : undefined,
          }}
          className={head_2}
        >
          {children}
        </div>
      )
    case "3":
      return (
        <div
          {...attributes}
          style={{
            display: element.collapsed ? "none" : undefined,
          }}
          className={head_3}
        >
          {children}
        </div>
      )
    case "4":
      return (
        <div
          {...attributes}
          style={{
            display: element.collapsed ? "none" : undefined,
          }}
          className={head_4}
        >
          {children}
        </div>
      )
    case "5":
      return (
        <div
          {...attributes}
          style={{
            display: element.collapsed ? "none" : undefined,
          }}
          className={head_5}
        >
          {children}
        </div>
      )
    case "6":
      return (
        <div
          {...attributes}
          style={{
            display: element.collapsed ? "none" : undefined,
          }}
          className={head_6}
        >
          {children}
        </div>
      )
  }
}

export default Head
