import { ReactEditor, useSelected, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps, KeysUnion } from "../../../../types/utils"
import { blockCodeCodeArea, blockCodeContainer, blockCodeOrderWrapper } from "./BlockCode.css"
import type { IBlockCode, ICodeAreaLangMap } from "./types"
import { Select } from "@arco-design/web-react"
import { Transforms } from "slate"
import { codeAreaLangMap } from "./constant"
import React, { useEffect, useRef } from "react"
import Scrollbar from "smooth-scrollbar"

//FIXME: 代码块内无法正常换行
//FIXME: 代码块无法正常删除
//TODO: 代码较长时出现横向滚动条
const BlockCode: React.FC<CustomRenderElementProps<IBlockCode>> = ({ attributes, children, element }) => {
  const isSelected = useSelected()
  const editor = useSlateStatic()

  const orderNumbersWrapperDom = useRef<HTMLDivElement | null>(null)

  const langOptions: KeysUnion<ICodeAreaLangMap>[] = Object.keys(codeAreaLangMap) as KeysUnion<ICodeAreaLangMap>[]

  useEffect(() => {
    const codeLinesWrapperDom = ReactEditor.toDOMNode(editor, element.children[0])
    if (codeLinesWrapperDom && orderNumbersWrapperDom.current) {
      for (const [index, codeLineDom] of Array.from(codeLinesWrapperDom.children).entries()) {
        // 22 是行高
        const num = Math.floor(codeLineDom.clientHeight / 22)
        const ord = orderNumbersWrapperDom.current.children.item(index)
        if (ord) {
          ord.replaceChildren((index + 1).toString())
          for (let i = 1; i <= num - 1; i++) {
            ord.insertAdjacentHTML("beforeend", "<br>&nbsp;")
          }
        }
      }
    }
  }, [element.children[0]])

  useEffect(() => {
    return () => {
      const dom = document.querySelector<HTMLElement>(`.block-code-selector-${ReactEditor.findKey(editor, element).id}`)
      if (dom) {
        Scrollbar.destroy(dom)
      }
    }
  }, [])

  return (
    <div
      {...attributes}
      style={{
        border: isSelected ? "1px solid #5a87f7" : undefined,
      }}
      className={blockCodeContainer}
    >
      <div
        contentEditable={false}
        style={{
          userSelect: "none",
        }}
      >
        <Select
          defaultValue={element.langKey}
          showSearch={true}
          dropdownMenuClassName={`block-code-selector-${ReactEditor.findKey(editor, element).id}`}
          style={{ width: 154 }}
          onChange={(value) => {
            const codeAreaPath = ReactEditor.findPath(editor, element)
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
          onVisibleChange={(visible) => {
            // 下拉菜单的 dom 更新是异步的, 因此需要一个定时器延后执行回调
            setTimeout(() => {
              const dom = document.querySelector<HTMLElement>(
                `.block-code-selector-${ReactEditor.findKey(editor, element).id}`
              )
              if (visible && dom) {
                Scrollbar.init(dom)
              }
            })

            const dom = document.querySelector<HTMLElement>(
              `.block-code-selector-${ReactEditor.findKey(editor, element).id}`
            )
            if (!visible && dom) {
              Scrollbar.destroy(dom)
            }
          }}
        >
          {langOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={blockCodeCodeArea}>
        <div
          ref={orderNumbersWrapperDom}
          contentEditable={false}
          className={blockCodeOrderWrapper}
          style={{
            minWidth: `${element.children[0].children.length.toString().length * 8 + 20}px`,
          }}
        >
          {[...Array(element.children[0].children.length).keys()].map((i) => {
            return <span key={(i + 1).toString()}>{i + 1}</span>
          })}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default BlockCode
