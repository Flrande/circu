import { FolderClose, Star } from "@icon-park/react"
import { useState } from "react"

const FolderBlock: React.FC<{
  name: string
}> = ({ name }) => {
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
      className={"rounded-md border border-solid border-[#393939] hover:border-[#4c88ff] px-4 py-5 flex items-center"}
    >
      <div>
        <FolderClose theme="filled" size="24" fill="#f8e71c" strokeLinejoin="bevel" strokeLinecap="square" />
      </div>
      <div className={"ml-3 mr-1 text-sm text-[#ebebeb]"}>
        <span>{name}</span>
      </div>
      <div
        className={"p-[2px] rounded-md hover:bg-[#2f2f2f]"}
        style={{
          display: isHover ? undefined : "none",
        }}
      >
        <Star theme="outline" size="16" fill="#9b9b9b" strokeLinejoin="bevel" strokeLinecap="square" />
      </div>
    </div>
  )
}

export default FolderBlock
