import { useEffect, useState } from "react"
import ScrollBar from "smooth-scrollbar"
import { useTopDocs } from "../../../../server/doc"
import Doc from "./Doc"

const SideBar: React.FC = () => {
  const { topDocs, errorGetTopDocs } = useTopDocs()

  const [isResizeColDrag, setIsResizeColDrag] = useState(false)
  const [sideBarWidth, setSideBarWidth] = useState(
    window.localStorage.getItem("sidebar_width") ? parseInt(window.localStorage.getItem("sidebar_width")!) : 288
  )

  useEffect(() => {
    const controller = new AbortController()

    if (isResizeColDrag) {
      document.addEventListener(
        "mousemove",
        (event) => {
          if (isResizeColDrag && event.screenX >= 220 && event.screenX <= 480) {
            setSideBarWidth(event.screenX)
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

  useEffect(() => {
    // 将用户的设置持久化到 localStorage
    window.localStorage.setItem("sidebar_width", sideBarWidth.toString())
  }, [sideBarWidth])

  useEffect(() => {
    ScrollBar.init(document.getElementById("side-bar-root")!)
  }, [])

  return (
    <div
      className={"shrink-0 bg-[#202020] h-full relative z-10"}
      style={{
        flexBasis: `${sideBarWidth}px`,
      }}
    >
      <div id={"side-bar-root"} className={"h-full"}>
        <div className={"bg-transparent h-12 mb-11"}></div>
        <div className={"bg-transparent p-4"}>
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
  )
}

export default SideBar
