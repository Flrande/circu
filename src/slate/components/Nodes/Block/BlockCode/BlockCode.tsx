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

  // TODO-BUG:
  //
  // -- 2022-4-1 --
  // Edge, Chrome 上出现滚动条后选区限制失效, Firefox 完全失效
  // 前者考虑为谷歌内核的问题, 后者考虑为浏览器之间对 mousemove event 的实现不一致
  // 具体见下
  // https://github.com/w3c/uievents/issues/278
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1219471
  // https://bugs.chromium.org/p/chromium/issues/detail?id=346473
  // 因而在找到绕过方式前暂时注释掉该段代码
  //

  // // 用于限制用户的选区
  // // 选择起始点在代码块内时无法选择代码块外的内容
  // const [containerDom, setContainerDom] = useState<HTMLElement>()

  // useEffect(() => {
  //   if (containerDom) {
  //     const onDocumentMouseMove = (event: Event) => {
  //       event.preventDefault()
  //     }
  //     const onDocumentMouseUp = () => {
  //       containerDom.removeEventListener("mouseenter", onDomMouseEnter)
  //       document.removeEventListener("mousemove", onDocumentMouseMove)
  //     }
  //     const onDomMouseEnter = () => {
  //       document.removeEventListener("mousemove", onDocumentMouseMove)
  //     }
  //     const onDomMouseLeave = () => {
  //       const sel = document.getSelection()
  //       if (sel && containerDom.contains(sel.anchorNode)) {
  //         document.addEventListener("mousemove", onDocumentMouseMove)
  //         containerDom.addEventListener("mouseenter", onDomMouseEnter)
  //       } else {
  //         document.removeEventListener("mousemove", onDocumentMouseMove)
  //       }
  //     }

  //     containerDom.addEventListener("mouseleave", onDomMouseLeave)
  //     document.addEventListener("mouseup", onDocumentMouseUp)

  //     return () => {
  //       containerDom.removeEventListener("mouseleave", onDomMouseLeave)
  //     }
  //   }
  // }, [containerDom, document.body.clientWidth])

  // useEffect(() => {
  //   setContainerDom(ReactEditor.toDOMNode(editor, element))
  // }, [editor, element])

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
