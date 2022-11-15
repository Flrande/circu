import * as Y from "yjs"
import randomColor from "randomcolor"
import { withCursors, withYHistory, withYjs, YjsEditor } from "@slate-yjs/core"
import { createCircuEditor, CustomElement, CustomText } from "circu-editor"
import { useMemo, useState } from "react"
import { createSocketIoProvider } from "../../crdt/provider"
import { SLATE_VALUE_YDOC_KEY } from "../../crdt/constants"
import { useParams } from "react-router-dom"
import { subscribeKey } from "valtio/utils"
import { Button } from "@arco-design/web-react"
import type { Editor } from "slate"
import CircuProvider from "circu-editor/src/CircuProvider"
import DocEditable from "./DocEditable"

export type CursorData = {
  color: string
  name: string
}

//TODO: 规范快捷键
//TODO: 离线提示
const Doc: React.FC = () => {
  const { docId } = useParams()

  const [value, setValue] = useState<(CustomElement | CustomText)[]>([])

  //TODO: 地址 -> 环境变量
  const [provider, providerStore] = useMemo(() => createSocketIoProvider("localhost:8000", docId!), [docId])

  const editor = useMemo(() => {
    const editor = withCursors<CursorData, YjsEditor>(
      withYHistory(withYjs(createCircuEditor(), provider.YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText)),
      provider.awareness,
      {
        data: {
          color: randomColor({
            luminosity: "dark",
            alpha: 1,
            format: "hex",
          }),
          //TODO: 获取当前登录用户的名字
          name: "Tom",
        },
      }
    )

    subscribeKey(providerStore, "sync", (v) => {
      if (v) {
        console.log("YjsEditor connect")
        YjsEditor.connect(editor)
      } else {
        console.log("YjsEditor disconnect")
        YjsEditor.disconnect(editor)
      }
    })

    return editor
  }, [provider.YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText), provider.awareness])

  return (
    <div className={"bg-[#1a1a1a] grid grid-rows-[56px_auto] h-full"}>
      <div className={"border-b border-[#5f5f5f]"}>
        <Button
          onClick={() => {
            if (providerStore.connected || providerStore.connecting) {
              provider.disconnect()
            } else {
              provider.connect()
            }
          }}
        ></Button>
      </div>
      <div className={"editor-container overflow-y-scroll"}>
        <CircuProvider editor={editor as unknown as Editor} value={value} onChange={(newValue) => setValue(newValue)}>
          <DocEditable></DocEditable>
        </CircuProvider>
      </div>
    </div>
  )
}

export default Doc
