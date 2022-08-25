import { Outlet } from "react-router-dom"

const Drive: React.FC = () => {
  return (
    <div>
      <div>侧边栏</div>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Drive
