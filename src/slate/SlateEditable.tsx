import { Editable } from "slate-react"
import { useOnKeyDown } from "./hooks/hotKeysHooks"
import { useRenderLeaf, useRenderElement } from "./hooks/renderHooks"
import { useDecorate } from "./hooks/useDecorate"
import { useEndLine } from "./hooks/useEndLine"
import { useMouse } from "./state/mouse"

const SlateEditable: React.FC = () => {
  const renderLeaf = useRenderLeaf()
  const renderElement = useRenderElement()
  const onKeyDown = useOnKeyDown()
  const decorate = useDecorate()

  useMouse()
  useEndLine()

  return (
    <Editable
      decorate={decorate}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={onKeyDown}
      spellCheck={false}
    ></Editable>
  )
}

export default SlateEditable
