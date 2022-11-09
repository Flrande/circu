import { ReactEditor, useSelected, useSlateStatic } from "slate-react"
import type { CustomRenderElementProps, KeysUnion } from "../../../../types/utils"
import type { IBlockCode, ICodeAreaLangMap } from "./types"
import { Button, Select } from "@arco-design/web-react"
import { Transforms } from "slate"
import { codeAreaLangMap } from "./constant"
import React, { useEffect, useRef, useState } from "react"
import Scrollbar from "smooth-scrollbar"
import { useScrollbar } from "../../../../hooks/useScrollbar"
import { useDropBlock } from "../../../Draggable/useDropBlock"
import DragMarkLine from "../../../Draggable/DragMarkLine"
import { useMouseXBlockDetect } from "../../../../state/mouse"

const BlockCode: React.FC<CustomRenderElementProps<IBlockCode>> = ({ attributes, children, element }) => {
  const isSelected = useSelected()
  const editor = useSlateStatic()
  const blockCodePath = ReactEditor.findPath(editor, element)

  const { onMouseEnterForDrag, onMouseLeaveForDrag } = useMouseXBlockDetect(element)

  const orderNumbersWrapperDom = useRef<HTMLDivElement | null>(null)
  // TODO: 云端保留用户设置, 根据服务器响应赋初始值
  const [isWrap, setIsWrap] = useState(true)
  const [isWrapMessage, setIsWrapMessage] = useState("取消自动换行")

  const { newAttributes, onDragOver, dragActiveLine } = useDropBlock(element, attributes)

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
          if (isWrap) {
            for (let i = 1; i <= num - 1; i++) {
              ord.insertAdjacentHTML("beforeend", "<br>&nbsp;")
            }
          }
        }
      }
    }
  }, [element.children[0], isWrap])

  // 卸载组件时删除语言选择器的滚动条实例
  useEffect(() => {
    return () => {
      const dom = document.querySelector<HTMLElement>(`.block-code-selector-${ReactEditor.findKey(editor, element).id}`)
      if (dom) {
        Scrollbar.destroy(dom)
      }
    }
  }, [])

  // 设置代码区域的滚动条
  useEffect(() => {
    const dom = document.querySelector<HTMLElement>(`.block-code-area-${ReactEditor.findKey(editor, element).id}`)
    if (dom && !isWrap) {
      Scrollbar.init(dom)

      return () => {
        Scrollbar.destroy(dom)
      }
    }
  }, [])

  useScrollbar()

  return (
    <div
      data-circu-node="block"
      {...newAttributes}
      onDragOver={onDragOver}
      onMouseEnter={onMouseEnterForDrag}
      onMouseLeave={onMouseLeaveForDrag}
      style={{
        border: isSelected ? "1px solid #5a87f7" : undefined,
        display: element.isHidden ? "none" : undefined,
      }}
      className={"bg-zinc-800 my-2 text-sm font-normal rounded relative"}
    >
      {blockCodePath.at(-1) !== 0 && (
        <div
          // 点击两个相邻代码块的中间区域, 插入一个空行
          onClick={() => {
            Transforms.insertNodes(
              editor,
              {
                type: "paragraph",
                children: [
                  {
                    type: "__block-element-content",
                    children: [
                      {
                        type: "text-line",
                        children: [
                          {
                            text: "",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                at: blockCodePath,
              }
            )
          }}
          data-circu-node="block-space"
          contentEditable={false}
          className={"absolute left-0 -top-2 w-full h-2 select-none"}
        ></div>
      )}
      <div
        contentEditable={false}
        style={{
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
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
        <Button
          style={{
            borderRadius: "4px",
          }}
          onClick={() => {
            const dom = document.querySelector<HTMLElement>(
              `.block-code-area-${ReactEditor.findKey(editor, element).id}`
            )
            if (dom) {
              if (isWrap) {
                // 取消换行, 初始化滚动条
                setIsWrap(false)
                setIsWrapMessage("启用自动换行")
                Scrollbar.init(dom)
              } else {
                // 启动换行, 卸载滚动条
                setIsWrap(true)
                setIsWrapMessage("取消自动换行")
                Scrollbar.destroy(dom)
              }
            }
          }}
          type="secondary"
        >
          {isWrapMessage}
        </Button>
      </div>
      <div className={"flex min-h-[49px] leading-[22px] py-2 px-5"}>
        <div
          ref={orderNumbersWrapperDom}
          contentEditable={false}
          className={"flex flex-col sticky left-0 select-none text-gray-400 pr-3 whitespace-nowrap text-right"}
          style={{
            minWidth: `${element.children[0].children.length.toString().length * 8 + 20}px`,
          }}
        >
          {[...Array(element.children[0].children.length).keys()].map((i) => {
            return <span key={(i + 1).toString()}>{i + 1}</span>
          })}
        </div>
        <div className={`block-code-area-${ReactEditor.findKey(editor, element).id}`}>
          <div
            style={{
              whiteSpace: !isWrap ? "nowrap" : undefined,
              marginBottom: "16px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <DragMarkLine activeDirection={dragActiveLine}></DragMarkLine>
    </div>
  )
}

export default BlockCode
