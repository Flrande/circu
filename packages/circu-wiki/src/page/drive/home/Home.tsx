import { DocDetail, Down, FolderClose } from "@icon-park/react"
import { useEffect, useRef, useState } from "react"
import DocList from "../components/DocList/DocList"
import FolderBlock from "../components/FolderBlock/FolderBlock"
import ScrollBar from "smooth-scrollbar"

const Home: React.FC = () => {
  const [isButtonHover, setIsButtonHover] = useState(false)

  const buttonDom = useRef<HTMLButtonElement>(null)
  const rootDom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    //TODO: 粘性布局
    if (rootDom.current) {
      ScrollBar.init(rootDom.current)
    }
  })

  return (
    <div ref={rootDom} className={"flex flex-col py-3 px-8 h-full"}>
      <div className={"flex items-center justify-between my-4"}>
        <div>
          <span className={"text-xl text-[#ebebeb] font-semibold"}>主页</span>
        </div>
        <div>
          <button
            ref={buttonDom}
            onMouseEnter={() => {
              setIsButtonHover(true)
            }}
            onMouseLeave={() => {
              setIsButtonHover(false)
            }}
            className={"rounded-md bg-[#4c88ff] py-1 px-5 text-[#ebebeb] min-w-[84px] flex items-center relative"}
            style={{
              backgroundColor: isButtonHover ? "#2e65d0" : undefined,
            }}
          >
            <span className={"text-base"}>新建</span>
            <div
              className={"w-[14px] h-[14px] ml-1 transition"}
              style={{
                transform: isButtonHover ? "rotate(0.5turn)" : undefined,
              }}
            >
              <Down theme="outline" size="14" fill="#ebebeb" strokeLinejoin="bevel" strokeLinecap="square" />
            </div>
            <div
              className={"absolute w-[160px] bg-transparent py-1 right-0"}
              style={{
                display: isButtonHover ? undefined : "none",
                top: `${buttonDom.current?.clientHeight}px`,
              }}
            >
              <div className={"bg-[#292929] flex flex-col rounded-md border border-solid border-[#464646] p-2"}>
                <div className={"flex items-center p-2 rounded-md hover:bg-[#383838]"}>
                  <DocDetail theme="filled" size="22" fill="#4a90e2" strokeLinejoin="bevel" strokeLinecap="square" />
                  <div className={"text-[#ebebeb] text-base ml-2"}>
                    <span>新建文档</span>
                  </div>
                </div>
                <div className={"flex items-center p-2 rounded-md hover:bg-[#383838]"}>
                  <FolderClose theme="filled" size="22" fill="#f8e71c" strokeLinejoin="bevel" strokeLinecap="square" />
                  <div className={"text-[#ebebeb] text-base ml-2"}>
                    <span>新建文件夹</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className={"my-3"}>
        <div>
          <span className={"text-lg text-[#ebebeb] font-semibold"}>快速访问</span>
        </div>
        <div
          className={
            "py-3 grid gap-3 grid-cols-[repeat(auto-fill,minmax(268px,1fr))] 2xl:grid-cols-[repeat(4,minmax(268px,360px))]"
          }
        >
          <FolderBlock name={"学习"}></FolderBlock>
          <FolderBlock name={"学习"}></FolderBlock>
          <FolderBlock name={"学习"}></FolderBlock>
          <FolderBlock name={"学习"}></FolderBlock>
          <FolderBlock name={"学习"}></FolderBlock>
          <FolderBlock name={"学习"}></FolderBlock>
        </div>
      </div>
      <div className={"my-3"}>
        <div>
          <span className={"text-lg text-[#ebebeb] font-semibold"}>文档</span>
        </div>
        <div className={"py-3"}>
          <DocList
            docs={[
              {
                name: "测试文件",
                author: "Tom",
                lastModify: "1月1日 0:0",
              },
              {
                name: "测试文件",
                author: "Tom",
                lastModify: "1月1日 0:0",
              },
              {
                name: "测试文件",
                author: "Tom",
                lastModify: "1月1日 0:0",
              },
              {
                name: "测试文件",
                author: "Tom",
                lastModify: "1月1日 0:0",
              },
              {
                name: "测试文件",
                author: "Tom",
                lastModify: "1月1日 0:0",
              },
            ]}
          ></DocList>
        </div>
      </div>
    </div>
  )
}

export default Home
