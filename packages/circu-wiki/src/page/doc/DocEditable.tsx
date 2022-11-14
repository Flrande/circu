import { getRemoteCaretsOnLeaf, getRemoteCursorsOnLeaf, useDecorateRemoteCursors } from "@slate-yjs/react"
import { CircuEditable } from "circu-editor"
import type { Text } from "slate"
import type { RenderLeafProps } from "slate-react"
import type { CursorData } from "./Doc"

const addAlpha = (hexColor: string, opacity: number): string => {
  const normalized = Math.round(Math.min(Math.max(opacity, 0), 1) * 255)
  return hexColor + normalized.toString(16).toUpperCase()
}

const renderDecoratedLeafProps = (props: RenderLeafProps) => {
  getRemoteCursorsOnLeaf<CursorData, Text>(props.leaf).forEach((cursor) => {
    if (cursor.data) {
      props.children = <span style={{ backgroundColor: addAlpha(cursor.data.color, 0.5) }}>{props.children}</span>
    }
  })

  getRemoteCaretsOnLeaf<CursorData, Text>(props.leaf).forEach((caret) => {
    if (caret.data) {
      props.children = (
        <span className="relative">
          <span
            contentEditable={false}
            className="absolute top-0 bottom-0 w-0.5 left-[-1px]"
            style={{ backgroundColor: caret.data.color }}
          />
          <span
            contentEditable={false}
            className="absolute text-xs text-white left-[-1px] top-0 whitespace-nowrap rounded rounded-bl-none px-1.5 py-0.5 select-none"
            style={{
              backgroundColor: caret.data.color,
              transform: "translateY(-100%)",
            }}
          >
            {caret.data.name}
          </span>
          {props.children}
        </span>
      )
    }
  })

  return props
}

const DocEditable: React.FC = () => {
  const decorate = useDecorateRemoteCursors()

  return <CircuEditable customDecorate={decorate} custonRenderLeafProps={renderDecoratedLeafProps}></CircuEditable>
}

export default DocEditable
