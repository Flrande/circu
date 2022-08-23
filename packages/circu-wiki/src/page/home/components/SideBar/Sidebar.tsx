import { useEffect, useState } from "react"
import ScrollBar from "smooth-scrollbar"
import { useSnapshot } from "valtio"
import IconMenuUnfold from "../../../../icons/IconMenuUnfold"
import { useTopDocs } from "../../../../server/doc"
import Doc from "./Doc"
import { sidebarState } from "./state"

export const Sidebar: React.FC = () => {
  const sidebarStateSnap = useSnapshot(sidebarState)

  // 拿到最顶部的文档数据
  const { topDocs, errorGetTopDocs } = useTopDocs()

  // 是否正在调节侧边栏宽度
  const [isResizeColDrag, setIsResizeColDrag] = useState(false)
  // 添加事件监听器, 用于调节侧边栏宽度
  useEffect(() => {
    const controller = new AbortController()

    if (isResizeColDrag) {
      document.addEventListener(
        "mousemove",
        (event) => {
          if (isResizeColDrag && event.clientX >= 220 && event.clientX <= 480) {
            sidebarState.sidebarWidth = event.clientX
          }
        },
        {
          signal: controller.signal,
        }
      )
      document.addEventListener(
        "mouseup",
        () => {
          setIsResizeColDrag(false)
        },
        {
          signal: controller.signal,
        }
      )
    }

    return () => {
      controller.abort()
    }
  }, [isResizeColDrag])

  // 初始化滚动条
  useEffect(() => {
    ScrollBar.init(document.getElementById("side-bar-root")!)
  }, [])

  return (
    <div
      className={"shrink-0 bg-transparent transition-[flex-basis] duration-200"}
      style={{
        flexBasis: `${sidebarStateSnap.isSidebarFolded ? 0 : sidebarStateSnap.sidebarWidth}px`,
      }}
    >
      <div
        className={"bg-[#202020] h-full absolute z-10 rounded-r transition-transform duration-200"}
        style={{
          width: `${sidebarStateSnap.sidebarWidth}px`,
          // 2 是宽度调节列的宽度
          transform: sidebarStateSnap.isSidebarFolded
            ? `translateX(-${2 + sidebarStateSnap.sidebarWidth}px)`
            : undefined,
        }}
      >
        <div id={"side-bar-root"} className={"h-full relative"}>
          <div className={"bg-transparent w-full absolute top-0"}>
            <div className={"flex w-full items-center justify-center px-4 py-2"}>
              <div className={"flex-1 text-xl text-gray-300"}>
                <div className={"flex items-center p-2"}>
                  <span>Flrande</span>
                </div>
              </div>
              <div
                onClick={() => {
                  sidebarState.isSidebarFolded = true
                }}
                className={"shrink-0 grow-0 p-[2px] text-gray-400 hover:bg-gray-400/20 rounded"}
              >
                <div className={"w-6 h-6"}>
                  <IconMenuUnfold></IconMenuUnfold>
                </div>
              </div>
            </div>
          </div>
          <div className={"bg-transparent pt-4 pl-4 pb-4 mt-24"}>
            {topDocs ? topDocs.map((doc) => <Doc key={doc.id} docId={doc.id}></Doc>) : <div></div>}
          </div>
        </div>
        <div
          onMouseDown={() => {
            setIsResizeColDrag(true)
          }}
          className={"absolute -right-[2px] top-0 h-full w-[2px] bg-transparent hover:bg-[#3d3d3d] cursor-col-resize"}
          style={{
            backgroundColor: isResizeColDrag ? "#3d3d3d" : undefined,
          }}
        ></div>
      </div>
    </div>
  )
}

export default Sidebar
