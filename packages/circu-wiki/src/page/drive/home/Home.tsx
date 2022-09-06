import { DocDetail, Down, FolderClose } from "@icon-park/react"
import { useRef, useState } from "react"

const Home: React.FC = () => {
  const [isButtonHover, setIsButtonHover] = useState(false)

  const buttonDom = useRef<HTMLButtonElement>(null)

  return (
    <div className={"flex flex-col p-3 h-full"}>
      <div className={"flex items-center py-2 px-6 justify-between"}>
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
      <div></div>
    </div>
  )
}

export default Home
