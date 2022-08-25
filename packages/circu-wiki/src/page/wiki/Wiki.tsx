import Editor from "./components/Editor/Editor"
import { Sidebar } from "./components/SideBar/Sidebar"

const Wiki: React.FC = () => {
  return (
    <div className={"flex h-full w-full bg-neutral-900"}>
      <Sidebar></Sidebar>
      <Editor></Editor>
    </div>
  )
}

export default Wiki
