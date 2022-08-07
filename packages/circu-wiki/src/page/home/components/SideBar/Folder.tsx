import { useState } from "react"
import { useFolder } from "../../../../server/folder"
import { DOC_ID_PREFIX, IDocId, IFolderId } from "../../../../server/interface"
import Doc from "./Doc"
import IconDown from "./icons/IconDown"
import IconFolderClose from "./icons/IconFolderClose"
import Skeleton from "react-loading-skeleton"

const Folder: React.FC<{
  folderId: IFolderId
}> = ({ folderId }) => {
  const { folder, errorGetFolder } = useFolder(folderId)
  const [isFolded, setIsFolded] = useState(true)

  return (
    <div className={"my-2 pl-3"}>
      {folder ? (
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
              <IconFolderClose></IconFolderClose>
            </span>
            <span className={"text-base font-medium truncate select-none"}>{folder.name}</span>
          </div>
          {!isFolded && (
            <ul>
              {folder.childrenId.map((id) =>
                id.startsWith(DOC_ID_PREFIX) ? (
                  <Doc key={id} docId={id as IDocId}></Doc>
                ) : (
                  <Folder key={id} folderId={id as IFolderId}></Folder>
                )
              )}
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

export default Folder
