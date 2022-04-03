import { ReactEditor, useSelected, useSlate } from "slate-react"
import type { CustomRenderElementProps, KeysUnion } from "../../../../types/utils"
import { BlockCodeContainer } from "./BlockCode.css"
import type { BlockCodeType, CodeAreaLangMap } from "./types"
import { Select } from "@arco-design/web-react"
import { SlateNode } from "../../../../types/slate"
import { Transforms } from "slate"

//TODO: 高亮语言选择
const BlockCode: React.FC<CustomRenderElementProps<BlockCodeType>> = ({ attributes, children, element }) => {
  const isSelected = useSelected()
  const editor = useSlate()

  const langOptions: KeysUnion<CodeAreaLangMap>[] = ["PlainText", "Javascript"]

  return (
    <div
      {...attributes}
      style={{
        border: isSelected ? "1px solid #5a87f7" : undefined,
      }}
      className={BlockCodeContainer}
    >
      <div contentEditable={false}>
        <Select
          defaultValue={langOptions[0]}
          style={{ width: 154 }}
          onChange={(value) => {
            const codeArea = SlateNode.child(element, 1)
            const codeAreaPath = ReactEditor.findPath(editor, codeArea)
            Transforms.setNodes(
              editor,
              {
                lang: value,
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
