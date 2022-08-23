import { proxy, subscribe } from "valtio"

export const sidebarState = proxy<{
  isSidebarFolded: boolean
  sidebarWidth: number
}>(
  window.localStorage.getItem("sidebar_state")
    ? JSON.parse(window.localStorage.getItem("sidebar_state")!)
    : {
        isSidebarFolded: false,
        sidebarWidth: 288,
      }
)

// 持久化侧边栏状态
subscribe(sidebarState, () => {
  window.localStorage.setItem("sidebar_state", JSON.stringify(sidebarState))
})
