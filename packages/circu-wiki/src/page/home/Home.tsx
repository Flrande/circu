import Editor from "./components/Editor/Editor"
import SideBar from "./components/SideBar/SideBar"

const Home: React.FC = () => {
  return (
    <div className={"flex w-screen h-screen"}>
      <SideBar></SideBar>
      <Editor></Editor>
    </div>
  )
}

export default Home
