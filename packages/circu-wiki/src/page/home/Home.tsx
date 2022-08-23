import Editor from "./components/Editor/Editor"
import { Sidebar } from "./components/SideBar/Sidebar"

const Home: React.FC = () => {
  return (
    <div className={"flex w-screen h-screen bg-neutral-900"}>
      <Sidebar></Sidebar>
      <Editor></Editor>
    </div>
  )
}

export default Home
