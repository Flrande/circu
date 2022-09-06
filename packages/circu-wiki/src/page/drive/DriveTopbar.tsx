import { Avatar } from "@arco-design/web-react"
import { Search } from "@icon-park/react"
import { useState } from "react"

const DriveTopbar: React.FC = () => {
  const [isInputFocus, setIsInputFocus] = useState(false)

  return (
    <div className={"bg-transparent flex items-center py-3 px-6"}>
      <div className={"flex-1 max-w-[540px] w-[540px] h-9"}>
        <div
          className={
            "flex p-1 rounded-md items-center h-full border border-solid border-[#393939] hover:border-[#5a87f7]"
          }
          style={{
            borderColor: isInputFocus ? "#5a87f7" : undefined,
          }}
        >
          <div className={"h-4 w-4 text-[#a6a6a6] ml-2 mr-3"}>
            <Search theme="outline" size="16" fill="#9b9b9b" strokeLinejoin="bevel" strokeLinecap="square" />
          </div>
          <input
            onFocus={() => {
              setIsInputFocus(true)
            }}
            onBlur={() => {
              setIsInputFocus(false)
            }}
            placeholder={"搜索"}
            className={"bg-transparent text-[#a6a6a6] flex-1"}
          ></input>
        </div>
      </div>
      <div className={"ml-auto"}>
        <Avatar className={"h-8 w-8"} style={{ backgroundColor: "#3370ff" }}>
          F
        </Avatar>
      </div>
    </div>
  )
}

export default DriveTopbar
