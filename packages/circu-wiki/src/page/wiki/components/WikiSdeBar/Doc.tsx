import IconDoc from "../../../../icons/IconDoc"
import Skeleton from "react-loading-skeleton"
import { useState } from "react"
import IconDown from "../../../../icons/IconDown"
import { useWikiDoc } from "../../../../server/wiki-doc"

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
            className={"flex items-center h-9 bg-transparent text-gray-400 hover:bg-[#383838] rounded cursor-pointer"}
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
