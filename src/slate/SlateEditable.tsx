import { Editable } from "slate-react"
import { useOnKeyDown } from "./hotKeysHooks"
import { useRenderElement, useRenderLeaf } from "./renderHooks"
import { useEditorMouse } from "./state/editorMouse"

const SlateEditable: React.FC = () => {
  const renderLeaf = useRenderLeaf()
  const renderElement = useRenderElement()
  const onKeyDown = useOnKeyDown()

  useEditorMouse()

  return <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={onKeyDown}></Editable>
}

export default SlateEditable
