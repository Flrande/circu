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
      decorate={decorate}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={onKeyDown}
      spellCheck={false}
      onCopy={onCopy}
    ></Editable>
  )
}

export default SlateEditable
