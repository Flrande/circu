import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Descendant, Editor } from "slate"
import { ReactEditor, Slate } from "slate-react"
import Draggable from "./slate/components/Draggable/Draggable"
import FoldButton from "./slate/components/FoldButton/FoldButton"
import OrderedListBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListBar"
import OrderedListModifyBar from "./slate/components/Nodes/Block/List/ListBar/OrderedListModifyBar"
import LinkBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkBar"
import LinkEditBar from "./slate/components/Nodes/Inline/Link/LinkBar/LinkEditBar"
import LinkButtonBar from "./slate/components/ToolBar/components/Link/LinkButtonBar"
import ToolBar from "./slate/components/ToolBar/ToolBar"
import SlateEditable from "./slate/SlateEditable"
import { mouseXStateStore } from "./slate/state/mouse"
import { DOC_WIDTH, EDITOR_ROOT_DOM_ID } from "./slate/types/constant"
import { SlateElement } from "./slate/types/slate"

export const CircuEditor: React.FC<{
  editor: Editor
  value: Descendant[]
  onChange: (value: Descendant[]) => void
}> = ({ editor, value, onChange }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        id={EDITOR_ROOT_DOM_ID}
        className={"flex justify-center bg-neutral-900 h-full"}
        style={{
          fontFamily: '"Source Code Pro", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "Microsoft Yahei"',
        }}
      >
        <div
          onMouseMove={(event) => {
            const docXPadding = (document.getElementById(EDITOR_ROOT_DOM_ID)!.clientWidth - DOC_WIDTH) / 2
            const y = event.clientY

            // 60 的取值随意, 确保水平位置不受缩进影响即可
            const elements = document.elementsFromPoint(docXPadding + DOC_WIDTH - 60, y)
            // 鼠标水平方向对应的块级节点的 dom 元素
            const blockDom = elements.find(
              (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block"
            )

            const spaceDom = elements.find(
              (ele) => ele instanceof HTMLElement && (ele as HTMLElement).dataset["circuNode"] === "block-space"
            )

            if (spaceDom && spaceDom.parentElement) {
              const blockNode = ReactEditor.toSlateNode(editor, spaceDom.parentElement)

              if (SlateElement.isElement(blockNode)) {
                const blockPath = ReactEditor.findPath(editor, blockNode)

                mouseXStateStore.xBlockPath = blockPath
              }

              return
            }

            if (blockDom) {
              const blockNode = ReactEditor.toSlateNode(editor, blockDom)

              if (SlateElement.isElement(blockNode)) {
                const blockPath = ReactEditor.findPath(editor, blockNode)

                mouseXStateStore.xBlockPath = blockPath
              }
            }
          }}
          onMouseLeave={() => {
            mouseXStateStore.xBlockPath = null
          }}
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
              <SlateEditable></SlateEditable>
              <div
                // 拦截冒泡的 mousedown 事件, 防止 ToolBar 工作异常
                onMouseDown={(event) => {
                  event.stopPropagation()
                }}
              >
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
