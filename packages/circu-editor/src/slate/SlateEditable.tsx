import { useCallback } from "react"
import { Editable } from "slate-react"
import { useToolBar } from "./components/ToolBar/state"
import { useOnKeyDown } from "./hooks/hotKeysHooks"
import { useRenderLeaf, useRenderElement } from "./hooks/renderHooks"
import { useDecorate } from "./hooks/useDecorate"
import { useEndLine } from "./hooks/useEndLine"
import { useOnCopy } from "./hooks/useOnCopy"

const SlateEditable: React.FC = () => {
  const renderLeaf = useRenderLeaf()
  const renderElement = useRenderElement()
  const onKeyDown = useOnKeyDown()
  const onCopy = useOnCopy()
  const decorate = useDecorate()

  useToolBar()
  useEndLine()

  return (
    <Editable
      placeholder="在此输入文本..."
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
    ></Editable>
  )
}

export default SlateEditable
