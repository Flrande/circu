import { CircuEditor, CustomElement, CustomText, useCircuEditor } from "circu-editor"
import type { ITitle } from "circu-editor/src/slate/components/Nodes/Block/Title/types"
import { useEffect, useRef, useState } from "react"
import ScrollBar from "smooth-scrollbar"
import { useSnapshot } from "valtio"
import IconMenuUnfold from "../../../../icons/IconMenuUnfold"
import { useTopDocs } from "../../../../server/doc"
import Doc from "../SideBar/Doc"
import { sidebarState } from "../SideBar/state"

const Editor: React.FC = () => {
  const editor = useCircuEditor()

  // 拿到最顶部的文档数据
  const { topDocs, errorGetTopDocs } = useTopDocs()

  const [isSidebarDisplay, setIsSidebarDisplay] = useState(false)

  const [value, setValue] = useState<(CustomElement | CustomText)[]>([
    {
      type: "title",
      children: [
        {
          type: "__block-element-content",
          children: [
            {
              type: "text-line",
              children: [
                {
                  text: "Demo",
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  const sidebarStateSnap = useSnapshot(sidebarState)

  const editorRootDom = useRef<HTMLDivElement | null>(null)
  const sidebarListDom = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (editorRootDom.current) {
      ScrollBar.init(editorRootDom.current)
    }
    if (sidebarListDom.current) {
      ScrollBar.init(sidebarListDom.current)
    }
  }, [])

  return (
    <div className={"flex-1 bg-transparent h-full relative"}>
      <div className={"bg-transparent h-12 w-full absolute top-0 z-[5]"}>
        <div className={"flex w-full items-center justify-center py-2 px-4"}>
          <div
            onClick={() => {
              sidebarState.isSidebarFolded = false
            }}
            onMouseEnter={() => {
              setIsSidebarDisplay(true)
            }}
            onMouseLeave={() => {
              setIsSidebarDisplay(false)
            }}
            className={"shrink-0 grow-0 p-[2px] text-gray-400 hover:bg-gray-400/20 rounded mr-2"}
            style={{
              display: sidebarStateSnap.isSidebarFolded ? undefined : "none",
            }}
          >
            <div className={"w-6 h-6 rotate-180"}>
              <IconMenuUnfold></IconMenuUnfold>
            </div>
          </div>
          <div className={"flex-1 text-xl text-gray-300"}>
            <div className={"flex items-center p-2 select-none"}>
              <span>{(value[0] as ITitle).children[0].children[0].children[0].text}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        onMouseEnter={() => {
          setIsSidebarDisplay(true)
        }}
        onMouseLeave={() => {
          setIsSidebarDisplay(false)
        }}
        className={
          "absolute left-0 top-12 z-[5] w-[288px] h-[700px] border-solid border border-[#333233] rounded-r-xl transition-transform duration-200"
        }
        style={{
          boxShadow: "0px 6px 24px 1px rgba(235, 235, 235, 0.08)",
          filter: "drop-shadow(rgba(31, 35, 41, 0.08) 0px 6px 24px)",
          transform: isSidebarDisplay ? undefined : "translateX(-288px)",
          display: sidebarStateSnap.isSidebarFolded ? undefined : "none",
        }}
      >
        <div className={"relative h-full pt-16"}>
          <div className={"bg-transparent w-full absolute top-0"}>
            <div className={"flex w-full items-center justify-center px-4 py-2"}>
              <div className={"flex-1 text-xl text-gray-300"}>
                <div className={"flex items-center p-2"}>
                  <span>Flrande</span>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={sidebarListDom}
            style={{
              height: "calc(100% - 64px)",
            }}
          >
            <div className={"bg-transparent pt-4 pl-4 pb-4 pr-2"}>
              {topDocs ? topDocs.map((doc) => <Doc key={doc.id} docId={doc.id}></Doc>) : <div></div>}
            </div>
          </div>
        </div>
      </div>

      <div ref={editorRootDom} className={"h-full pt-14"}>
        <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
      </div>
    </div>
  )
}

export default Editor
