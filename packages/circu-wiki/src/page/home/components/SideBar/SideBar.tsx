import { useEffect } from "react"
import ScrollBar from "smooth-scrollbar"
import { useFoldersId } from "../../../../server/folder"
import Folder from "./Folder"

const SideBar: React.FC = () => {
  const { foldersId, errorGetFolders } = useFoldersId()

  useEffect(() => {
    ScrollBar.init(document.getElementById("side-bar-root")!)
  }, [])

  return (
    <div id={"side-bar-root"} className={"basis-72 shrink-0 bg-[#202020]"}>
      <div className={"bg-transparent h-12 mb-11"}></div>
      <div className={"bg-transparent p-4"}>
        {foldersId ? foldersId.map((id) => <Folder key={id} folderId={id}></Folder>) : <div></div>}
      </div>
    </div>
  )
}

export default SideBar
