import { useDoc } from "../../../../server/doc"
import type { IDoc } from "../../../../server/interface"
import IconDoc from "./icons/IconDoc"
import Skeleton from "react-loading-skeleton"
import { useState } from "react"
import IconDown from "./icons/IconDown"

const Doc: React.FC<{
  docId: IDoc["id"]
}> = ({ docId }) => {
  const { doc, errorGetDoc } = useDoc(docId)
  const [isFolded, setIsFolded] = useState(true)

  return (
    <div className={"my-2 pl-3"}>
      {doc ? (
        <div>
          <div
            onClick={() => {
              setIsFolded(!isFolded)
            }}
            className={"flex items-center h-10 bg-transparent text-gray-400 hover:bg-[#383838] rounded cursor-pointer"}
          >
            <span
              className={"mx-2 w-4 shrink-0"}
              style={{
                transform: isFolded ? "rotate(-0.25turn)" : undefined,
              }}
            >
              <IconDown></IconDown>
            </span>
            <span className={"mx-2 w-5 shrink-0"}>
              <IconDoc></IconDoc>
            </span>
            <span className={"text-base font-medium truncate select-none"}>{doc.title}</span>
          </div>

          {!isFolded && (
            <ul>
              {doc.childrenId.map((id) => (
                <Doc key={id} docId={id}></Doc>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className={"h-10 cursor-not-allowed"}>
          <Skeleton height={"100%"} baseColor="#202020" highlightColor="#444"></Skeleton>
        </div>
      )}
    </div>
  )
}

export default Doc
