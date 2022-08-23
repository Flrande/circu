import { CircuEditor, CustomElement, CustomText, useCircuEditor } from "circu-editor"
import type { ITitle } from "circu-editor/src/slate/components/Nodes/Block/Title/types"
import { useEffect, useState } from "react"
import ScrollBar from "smooth-scrollbar"
import { useSnapshot } from "valtio"
import IconMenuUnfold from "../../../../icons/IconMenuUnfold"
import { sidebarState } from "../SideBar/state"

const Editor: React.FC = () => {
  const editor = useCircuEditor()
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

  useEffect(() => {
    ScrollBar.init(document.getElementById("editor-root")!)
  }, [])

  return (
    <div className={"flex-1 bg-transparent h-full relative"}>
      <div className={"bg-transparent h-12 w-full absolute top-0 z-[5]"}>
        <div className={"flex w-full items-center justify-center py-2 px-4"}>
          <div
            onClick={() => {
              sidebarState.isSidebarFolded = false
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
      <div id="editor-root" className={"h-full pt-14"}>
        <CircuEditor editor={editor} value={value} onChange={(newValue) => setValue(newValue)}></CircuEditor>
      </div>
    </div>
  )
}

export default Editor
