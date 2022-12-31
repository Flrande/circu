import { useCallback } from "react"
import type { BaseRange, NodeEntry } from "slate"
import { Editable, RenderLeafProps } from "slate-react"
import { useToolBar } from "./components/ToolBar/state"
import { useOnKeyDown } from "./hooks/hotKeysHooks"
import { useRenderLeaf, useRenderElement } from "./hooks/renderHooks"
import { useDecorate } from "./hooks/useDecorate"
import { useEndLine } from "./hooks/useEndLine"
import { useOnCopy } from "./hooks/useOnCopy"
import { useScrollBar } from "./hooks/useScrollbar"

const CircuEditable: React.FC<{
  customDecorate?: (entry: NodeEntry) => BaseRange[]
  custonRenderLeafProps?: (props: RenderLeafProps) => RenderLeafProps
}> = ({ customDecorate, custonRenderLeafProps }) => {
  const renderElement = useRenderElement()
  const onKeyDown = useOnKeyDown()
  const onCopy = useOnCopy()

  const baseDecorate = useDecorate()
  let decorate: (entry: NodeEntry) => BaseRange[]
  if (customDecorate) {
    decorate = (entry) => [...baseDecorate(entry), ...customDecorate(entry)]
  } else {
    decorate = baseDecorate
  }

  const baseRenderLeaf = useRenderLeaf()
  let renderLeaf: (props: RenderLeafProps) => JSX.Element
  if (custonRenderLeafProps) {
    renderLeaf = (props: RenderLeafProps) => baseRenderLeaf(custonRenderLeafProps(props))
  } else {
    renderLeaf = baseRenderLeaf
  }

  useToolBar()
  useEndLine()
  useScrollBar()

  return (
    <Editable
      decorate={decorate}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={onKeyDown}
      spellCheck={false}
      onCopy={onCopy}
      // 2022-7-28
      // 拖拽块级节点时默认的 onDrop 行为某些情况下会报错崩溃, 尚未找到稳定复现的方式
      onDrop={useCallback<React.DragEventHandler>((event) => {
        event.preventDefault()
      }, [])}
      className={"grid gap-y-2"}
    ></Editable>
  )
}

export { CircuEditable }
