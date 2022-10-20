import { DeleteOne, DocumentFolder, FolderClose, Home, Peoples, Star } from "@icon-park/react"
import type React from "react"
import { ReactElement, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSnapshot } from "valtio"
import { drivePageSignal, driverStateStore } from "./state"

const DriveSidebarItem: React.FC<{
  icon: ReactElement
  message: string
  signal: drivePageSignal
}> = ({ icon, message, signal }) => {
  const driverStateSnap = useSnapshot(driverStateStore)
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        driverStateStore.currentPage = signal
        navigate(`/drive/${signal}`)
      }}
      className={"flex items-center p-3 my-1 bg-transparent rounded-md hover:bg-[#353535]"}
      style={{
        backgroundColor: driverStateSnap.currentPage === signal ? "#313846" : undefined,
        color: driverStateSnap.currentPage === signal ? "#4c88ff" : "#ebebeb",
      }}
    >
      <div className={"w-5 h-5 ml-5"}>{icon}</div>
      <div className={"text-base ml-2 select-none"}>{message}</div>
    </div>
  )
}

const DriveSidebar: React.FC = () => {
  const driverStateSnap = useSnapshot(driverStateStore)

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
            driverStateStore.sidebarWidth = event.clientX
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

  return (
    <div
      className={"shrink-0 relative bg-[#262626] pr-[2px]"}
      style={{
        flexBasis: `${driverStateSnap.sidebarWidth}px`,
      }}
    >
      <div className={"h-full relative pt-20"}>
        <div className={"bg-transparent w-full absolute top-0"}>
          <div className={"flex w-full items-center justify-center px-4 py-2"}>
            <div className={"flex-1 text-xl text-gray-300"}>
              <div className={"flex items-center p-2"}>
                <span>Circu Docs</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={"p-2"}
          style={{
            height: "calc(100% - 80px)",
          }}
        >
          <DriveSidebarItem
            icon={<Home theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel" strokeLinecap="square" />}
            message={"主页"}
            signal={"home"}
          ></DriveSidebarItem>
          <DriveSidebarItem
            icon={
              <FolderClose
                theme="outline"
                size="20"
                fill="currentColor"
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            }
            message={"我的空间"}
            signal={"me"}
          ></DriveSidebarItem>
          <DriveSidebarItem
            icon={
              <Peoples theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel" strokeLinecap="square" />
            }
            message={"共享空间"}
            signal={"shared"}
          ></DriveSidebarItem>
          <DriveSidebarItem
            icon={<Star theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel" strokeLinecap="square" />}
            message={"收藏"}
            signal={"favorites"}
          ></DriveSidebarItem>
          <DriveSidebarItem
            icon={
              <DeleteOne theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel" strokeLinecap="square" />
            }
            message={"回收站"}
            signal={"trash"}
          ></DriveSidebarItem>
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
  )
}

export default DriveSidebar
