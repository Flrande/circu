import { proxy, subscribe } from "valtio"
import { WIKI_SIDEBAR_STATE } from "../../../../constants/local-storage-keys"

export const sidebarState = proxy<{
  isSidebarFolded: boolean
  sidebarWidth: number
}>(
  window.localStorage.getItem(WIKI_SIDEBAR_STATE)
    ? JSON.parse(window.localStorage.getItem(WIKI_SIDEBAR_STATE)!)
    : {
        isSidebarFolded: false,
        sidebarWidth: 288,
      }
)

// 持久化侧边栏状态
subscribe(sidebarState, () => {
  window.localStorage.setItem(WIKI_SIDEBAR_STATE, JSON.stringify(sidebarState))
})
