import { Outlet } from "react-router-dom"
import DriveSidebar from "./DriveSidebar"

const Drive: React.FC = () => {
  return (
    <div className={"flex h-full w-full bg-[#1a1a1a]"}>
      <DriveSidebar></DriveSidebar>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Drive
