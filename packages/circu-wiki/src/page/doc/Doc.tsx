import * as Y from "yjs"
import { withYHistory, withYjs, YjsEditor } from "@slate-yjs/core"
import { CircuEditor, createCircuEditor, CustomElement, CustomText } from "circu-editor"
import { useEffect, useMemo, useState } from "react"
import { createSocketIoProvider } from "../../crdt/provider"
import { SLATE_VALUE_YDOC_KEY } from "../../crdt/constants"
import { useParams } from "react-router-dom"
import { subscribeKey } from "valtio/utils"
import { Button } from "@arco-design/web-react"

//TODO: 规范快捷键
//TODO: 错误边界, 兜底, 监控
//FIXME?: 热更新抛错
const Doc: React.FC = () => {
  const { docId } = useParams()

  const [value, setValue] = useState<(CustomElement | CustomText)[]>([])

  //TODO: 地址 -> 环境变量
  const [provider, providerStore] = useMemo(() => createSocketIoProvider("localhost:8000", docId!), [docId])

  const editor = useMemo(
    () => withYHistory(withYjs(createCircuEditor(), provider.YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText)),
    []
  )

  useEffect(() => {
    const unsub = subscribeKey(providerStore, "sync", () => {
      YjsEditor.connect(editor)
    })

    return () => {
      unsub()
      YjsEditor.disconnect(editor)
    }
  }, [editor, providerStore])

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
      <div>
        <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
      </div>
    </div>
  )
}

export default Doc
