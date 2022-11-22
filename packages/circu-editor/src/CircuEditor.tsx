import { useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Descendant, Editor } from "slate"
import { Slate } from "slate-react"
import { CircuEditable } from "./slate/CircuEditable"
import Draggable from "./slate/components/Draggable/Draggable"
import FoldButton from "./slate/components/FoldButton/FoldButton"
import OrderedListBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListBar"
import OrderedListModifyBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListModifyBar"
import LinkBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkBar"
import LinkEditBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkEditBar"
import LinkButtonBar from "./slate/components/ToolBar/components/Link/LinkButtonBar"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import { DOC_WIDTH, EDITOR_ROOT_DOM_ID } from "./slate/types/constant"

export const CircuEditor: React.FC<{
  editor: Editor
  value: Descendant[]
  onChange: (value: Descendant[]) => void
}> = ({ editor, value, onChange }) => {
  const barContainerDom = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // 拦截冒泡的 mousedown 事件, 防止 ToolBar 工作异常
    if (barContainerDom.current) {
      const controller = new AbortController()

      // 不能使用 onMouseDown
      // https://github.com/facebook/react/issues/4335
      // https://github.com/wayou/wayou.github.io/issues/51
      barContainerDom.current.addEventListener(
        "mousedown",
        (event) => {
          event.stopPropagation()
        },
        {
          signal: controller.signal,
        }
      )

      return () => {
        controller.abort()
      }
    }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div id={EDITOR_ROOT_DOM_ID} className={"flex justify-center bg-neutral-900 h-full"}>
        <div
          style={{
            padding: "0 96px 0 96px",
          }}
        >
          <div
            className={"relative text-base text-slate-50 tracking-wide p-4"}
            style={{
              width: `${DOC_WIDTH}px`,
            }}
          >
            <Slate editor={editor} value={value} onChange={onChange}>
              <CircuEditable></CircuEditable>
              <div ref={barContainerDom}>
                <ToolBar></ToolBar>
                <LinkButtonBar></LinkButtonBar>
                <LinkBar></LinkBar>
                <LinkEditBar></LinkEditBar>
                <OrderedListBar></OrderedListBar>
                <OrderedListModifyBar></OrderedListModifyBar>
                <FoldButton></FoldButton>
                <Draggable></Draggable>
              </div>
            </Slate>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
