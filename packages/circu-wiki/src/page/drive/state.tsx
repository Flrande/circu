import { proxy } from "valtio"
import { subscribeKey } from "valtio/utils"
import { DRIVE_SIDEBAR_WIDTH } from "../../constants/local-storage-keys"

export type drivePageSignal = "home" | "me" | "shared" | "favorites" | "wiki" | "trash"

export const driverStateStore = proxy<{
  currentPage: drivePageSignal
  sidebarWidth: number
}>({
  currentPage: "home",
  sidebarWidth: window.localStorage.getItem(DRIVE_SIDEBAR_WIDTH)
    ? parseInt(window.localStorage.getItem(DRIVE_SIDEBAR_WIDTH)!)
    : 288,
})

subscribeKey(driverStateStore, "sidebarWidth", (sidebarWidth) => {
  window.localStorage.setItem(DRIVE_SIDEBAR_WIDTH, sidebarWidth.toString())
})
