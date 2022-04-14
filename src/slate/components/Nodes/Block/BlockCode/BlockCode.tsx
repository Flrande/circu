import { ReactEditor, useSelected, useSlate } from "slate-react"
import type { CustomRenderElementProps, KeysUnion } from "../../../../types/utils"
import { blockCodeContainer } from "./BlockCode.css"
import type { IBlockCode, IBlockCode_CodeArea, ICodeAreaLangMap } from "./types"
import { Select } from "@arco-design/web-react"
import { SlateNode } from "../../../../types/slate"
import { Transforms } from "slate"
import { codeAreaLangMap } from "./constant"

const BlockCode: React.FC<CustomRenderElementProps<IBlockCode>> = ({ attributes, children, element }) => {
  const isSelected = useSelected()
  const editor = useSlate()

  const langOptions: KeysUnion<ICodeAreaLangMap>[] = Object.keys(codeAreaLangMap) as KeysUnion<ICodeAreaLangMap>[]

  return (
    <div
      {...attributes}
      style={{
        border: isSelected ? "1px solid #5a87f7" : undefined,
      }}
      className={blockCodeContainer}
    >
      <div contentEditable={false}>
        <Select
          defaultValue={(SlateNode.child(element, 1) as IBlockCode_CodeArea).langKey}
          style={{ width: 154 }}
          onChange={(value) => {
            const codeArea = SlateNode.child(element, 1)
            const codeAreaPath = ReactEditor.findPath(editor, codeArea)
            Transforms.setNodes(
              editor,
              {
                langKey: value,
              },
              {
                at: codeAreaPath,
              }
            )
          }}
        >
          {langOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default BlockCode
