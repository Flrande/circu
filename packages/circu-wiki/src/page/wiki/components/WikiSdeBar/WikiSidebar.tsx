import { MenuUnfoldOne } from "@icon-park/react"
import { OverlayScrollbars } from "overlayscrollbars"
import { useEffect, useRef, useState } from "react"
import { useSnapshot } from "valtio"
import { useTopWikiDocs } from "../../../../server/wiki-doc"
import Doc from "./Doc"
import { sidebarState } from "./state"

export const WikiSidebar: React.FC = () => {
  const sidebarStateSnap = useSnapshot(sidebarState)

  // 拿到最顶部的文档数据
  const { data, error } = useTopWikiDocs()

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
      document.addEventListener(
        "selectstart",
        (event) => {
          event.preventDefault()
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

  const sidebarListDom = useRef<HTMLDivElement | null>(null)

  const sidebarOsInstanceRef = useRef<OverlayScrollbars>()

  useEffect(() => {
    if (sidebarListDom.current) {
      sidebarOsInstanceRef.current = OverlayScrollbars(sidebarListDom.current)
    }
  }, [])

  return (
    <div
      className={"shrink-0 pr-[2px] bg-transparent transition-[flex-basis] duration-200"}
      style={{
        flexBasis: `${sidebarStateSnap.isSidebarFolded ? 0 : sidebarStateSnap.sidebarWidth}px`,
      }}
    >
      <div
        className={"bg-[#202020] h-full absolute z-10 rounded-r transition-transform duration-200"}
        style={{
          width: `${sidebarStateSnap.sidebarWidth}px`,
          // 加 4 是因为要考虑宽度调节列的宽度
          transform: sidebarStateSnap.isSidebarFolded
            ? `translateX(-${4 + sidebarStateSnap.sidebarWidth}px)`
            : undefined,
        }}
      >
        <div className={"h-full relative pt-24"}>
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
                  <MenuUnfoldOne
                    theme="outline"
                    size="24"
                    fill="#ebebeb"
                    strokeLinejoin="bevel"
                    strokeLinecap="square"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            ref={sidebarListDom}
            style={{
              height: "calc(100% - 96px)",
            }}
          >
            <div className={"bg-transparent pt-4 pl-4 pb-4 pr-2"}>
              {data ? data.map((doc) => <Doc key={doc.id} docId={doc.id}></Doc>) : <div></div>}
            </div>
          </div>
        </div>

        <div
          onMouseDown={() => {
            setIsResizeColDrag(true)
          }}
          className={"absolute right-0 top-0 h-full w-[2px] bg-transparent hover:bg-[#3d3d3d] cursor-col-resize"}
          style={{
            backgroundColor: isResizeColDrag ? "#3d3d3d" : undefined,
          }}
        ></div>
      </div>
    </div>
  )
}

export default WikiSidebar
