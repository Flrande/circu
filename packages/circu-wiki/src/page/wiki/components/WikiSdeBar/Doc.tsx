import Skeleton from "react-loading-skeleton"
import { useState } from "react"
import { useWikiDoc } from "../../../../server/wiki-doc"
import { DocDetail, Down } from "@icon-park/react"

const Doc: React.FC<{
  docId: string
}> = ({ docId }) => {
  const { data, error } = useWikiDoc(docId)
  const [isFolded, setIsFolded] = useState(true)

  return (
    <div className={"my-1 pl-3"}>
      {data ? (
        <div>
          <div
            onClick={() => {
              setIsFolded(!isFolded)
            }}
            className={"flex items-center h-9 bg-transparent text-[#ebebeb] hover:bg-[#383838] rounded cursor-pointer"}
          >
            <span
              className={"mx-2 w-4 shrink-0"}
              style={{
                transform: isFolded ? "rotate(-0.25turn)" : undefined,
              }}
            >
              <Down theme="filled" size="16" fill="#a6a6a6" strokeLinejoin="bevel" strokeLinecap="square" />
            </span>
            <span className={"mx-2 w-5 shrink-0"}>
              <DocDetail theme="outline" size="20" fill="#a6a6a6" strokeLinejoin="bevel" strokeLinecap="square" />
            </span>
            <span className={"text-base font-medium truncate select-none"}>{data.title}</span>
          </div>

          {!isFolded && (
            <ul>
              {data.childrenDocsId.map((id) => (
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
