import { useEffect } from "react"
import ScrollBar from "smooth-scrollbar"

const SideBar: React.FC = () => {
  useEffect(() => {
    ScrollBar.init(document.getElementById("side-bar-root")!)
  }, [])

  return <div id={"side-bar-root"} className={"basis-72 shrink-0 bg-zinc-800"}></div>
}

export default SideBar
