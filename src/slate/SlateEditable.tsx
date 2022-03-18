import { Editable } from "slate-react"
import { useOnKeyDown } from "./hooks/hotKeysHooks"
import { useRenderLeaf, useRenderElement } from "./hooks/renderHooks"
import { useEndLine } from "./hooks/useEndLine"
import { useMouse } from "./state/mouse"

const SlateEditable: React.FC = () => {
  const renderLeaf = useRenderLeaf()
  const renderElement = useRenderElement()
  const onKeyDown = useOnKeyDown()

  useMouse()
  useEndLine()

  return (
    <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={onKeyDown} spellCheck={false}></Editable>
  )
}

export default SlateEditable
