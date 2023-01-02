import * as Y from "yjs"
import randomColor from "randomcolor"
import { faker } from "@faker-js/faker"
import { withCursors, withYHistory, withYjs, YjsEditor } from "@slate-yjs/core"
import { CircuProvider, createCircuEditor, CustomElement, CustomText } from "circu-editor"
import { useEffect, useMemo, useState } from "react"
import { createSocketIoProvider } from "../crdt/provider"
import { SLATE_VALUE_YDOC_KEY } from "../crdt/constants"
import { subscribeKey } from "valtio/utils"
import { Button } from "@arco-design/web-react"
import type { Editor } from "slate"
import DocEditable from "./DocEditable"
import { useMutation } from "@tanstack/react-query"
import { login } from "../server/login"

export type CursorData = {
  color: string
  name: string
}

//TODO: 规范快捷键
//TODO: 离线提示, 若尚未同步用户便关闭窗口, 提醒用户有修改未保存
const Doc: React.FC = () => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setLoginFlag(true)
    },
  })

  const [value, setValue] = useState<(CustomElement | CustomText)[]>([])
  const [loginFlag, setLoginFlag] = useState(false)

  //TODO: 地址 -> 环境变量
  const [provider, providerStore] = useMemo(
    () =>
      createSocketIoProvider(
        import.meta.env.VITE_CIRCU_SERVER_WS_URL ? import.meta.env.VITE_CIRCU_SERVER_WS_URL : "localhost:8000",
        loginFlag ? import.meta.env.VITE_TEST_DOC_ID : undefined
      ),
    [loginFlag]
  )

  const editor = useMemo(() => {
    if (provider) {
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
            name: faker.name.findName(),
          },
        }
      )

      if (providerStore.sync) {
        console.log("YjsEditor connect")
        YjsEditor.connect(editor)
      }
      subscribeKey(providerStore, "sync", (v) => {
        if (v) {
          console.log("YjsEditor connect")
          YjsEditor.connect(editor)
        }
      })

      return editor
    }
    return null
  }, [provider])

  useEffect(() => {
    if (import.meta.env.VITE_TEST_USER_NAME && import.meta.env.VITE_TEST_USER_PASSWORD) {
      mutation.mutate({
        username: import.meta.env.VITE_TEST_USER_NAME,
        password: import.meta.env.VITE_TEST_USER_PASSWORD,
        options: {
          ifCarrySession: false,
        },
      })
    }
  }, [])

  return (
    <div className={"bg-[#1a1a1a] grid grid-rows-[56px_auto] h-full"}>
      <div className={"border-b border-[#5f5f5f]"}>
        <Button
          onClick={() => {
            if (provider) {
              if (providerStore.connected) {
                provider.disconnect()
              } else {
                provider.connect()
              }
            }
          }}
        ></Button>
      </div>
      <div
        className={"editor-container overflow-y-scroll"}
        style={{
          pointerEvents: editor && YjsEditor.connected(editor) ? undefined : "none",
        }}
      >
        {provider && editor && (
          <CircuProvider editor={editor as unknown as Editor} value={value} onChange={(newValue) => setValue(newValue)}>
            <DocEditable></DocEditable>
          </CircuProvider>
        )}
      </div>
    </div>
  )
}

export default Doc
