import { Editor } from "slate"
import { useSelected, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { ITitle } from "./types"

const Title: React.FC<CustomRenderElementProps<ITitle>> = ({ attributes, children }) => {
  const editor = useSlateStatic()
  const isSelected = useSelected()

  return (
    <div
      {...attributes}
      className={
        !isSelected && Editor.string(editor, [0]) === "" ? "empty-title text-5xl mt-14 mb-5" : "text-5xl mt-14 mb-5"
      }
    >
      {children}
    </div>
  )
}

export default Title
