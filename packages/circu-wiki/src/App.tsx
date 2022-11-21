import { BrowserRouter, Route, Routes } from "react-router-dom"
import Doc from "./page/doc/Doc"
import Drive from "./page/drive/Drive"
import Favorites from "./page/drive/favorites/Favorites"
import Home from "./page/drive/home/Home"
import Me from "./page/drive/me/Me"
import Shared from "./page/drive/shared/Shared"
import Trash from "./page/drive/trash/Trash"
import Login from "./page/login/Login"
import NotFound from "./page/notFound/NotFound"
import Wiki from "./page/wiki/Wiki"

//TODO: react-router 改成配置形式
const App: React.FC = () => {
  return (
    <div className={"h-screen overflow-hidden"}>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<Login></Login>}></Route>
          <Route path={"drive"} element={<Drive></Drive>}>
            <Route path={"home"} element={<Home></Home>}></Route>
            <Route path={"me"} element={<Me></Me>}></Route>
            <Route path={"shared"} element={<Shared></Shared>}></Route>
            <Route path={"favorites"} element={<Favorites></Favorites>}></Route>
            <Route path={"trash"} element={<Trash></Trash>}></Route>
            <Route index element={<NotFound></NotFound>}></Route>
          </Route>
          <Route path={"/wiki"} element={<Wiki></Wiki>}></Route>
          <Route path={"/doc/:docId"} element={<Doc></Doc>}></Route>
          <Route path={"*"} element={<NotFound></NotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
