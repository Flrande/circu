import { Outlet } from "react-router-dom"
import DriveSidebar from "./DriveSidebar"
import DriveTopbar from "./DriveTopbar"

const Drive: React.FC = () => {
  return (
    <div className={"flex h-full w-full bg-[#1a1a1a]"}>
      <DriveSidebar></DriveSidebar>
      <div className={"flex-col flex-1"}>
        <DriveTopbar></DriveTopbar>
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

export default Drive
