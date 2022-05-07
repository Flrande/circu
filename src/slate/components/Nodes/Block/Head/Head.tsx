import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IHead } from "./types"

const Head: React.FC<CustomRenderElementProps<IHead>> = ({ attributes, children, element }) => {
  switch (element.headGrade) {
    case "1":
      return (
        <div
          {...attributes}
          style={{
            fontSize: "26px",
            marginBottom: "10px",
            marginTop: "1em",
            fontWeight: "600",
            letterSpacing: ".02em",
            lineHeight: "1.65",
          }}
        >
          <div
            style={{
              marginLeft: `${element.indentLevel * 22}px`,
            }}
          >
            {children}
          </div>
        </div>
      )
    case "2":
      return (
        <div
          {...attributes}
          style={{
            fontSize: "22px",
            marginBottom: "8px",
            marginTop: "1em",
            fontWeight: "600",
            letterSpacing: ".02em",
            lineHeight: "1.65",
          }}
        >
          <div
            style={{
              marginLeft: `${element.indentLevel * 22}px`,
            }}
          >
            {children}
          </div>
        </div>
      )
    case "3":
      return (
        <div
          {...attributes}
          style={{
            fontSize: "20px",
            marginBottom: "8px",
            marginTop: "1em",
            fontWeight: "600",
            letterSpacing: ".02em",
            lineHeight: "1.65",
          }}
        >
          <div
            style={{
              marginLeft: `${element.indentLevel * 22}px`,
            }}
          >
            {children}
          </div>
        </div>
      )
    case "4":
      return (
        <div
          {...attributes}
          style={{
            fontSize: "18px",
            marginBottom: "8px",
            marginTop: "1em",
            fontWeight: "600",
            letterSpacing: ".02em",
            lineHeight: "1.65",
          }}
        >
          <div
            style={{
              marginLeft: `${element.indentLevel * 22}px`,
            }}
          >
            {children}
          </div>
        </div>
      )
    case "5":
      return (
        <div
          {...attributes}
          style={{
            fontSize: "16px",
            marginBottom: "8px",
            marginTop: "1em",
            fontWeight: "600",
            letterSpacing: ".02em",
            lineHeight: "1.65",
          }}
        >
          <div
            style={{
              marginLeft: `${element.indentLevel * 22}px`,
            }}
          >
            {children}
          </div>
        </div>
      )
    case "6":
      return (
        <div
          {...attributes}
          style={{
            fontSize: "16px",
            marginBottom: "8px",
            marginTop: "1em",
            fontWeight: "600",
            letterSpacing: ".02em",
            lineHeight: "1.65",
          }}
        >
          <div
            style={{
              marginLeft: `${element.indentLevel * 22}px`,
            }}
          >
            {children}
          </div>
        </div>
      )
  }
}

export default Head
