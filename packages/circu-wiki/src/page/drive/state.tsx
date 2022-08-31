import { proxy } from "valtio"

export const driverStateStore = proxy<{
  currentPage: "home" | "me" | "shared" | "favorites" | "wiki" | "trash"
  sidebarWidth: number
}>({
  currentPage: "home",
  sidebarWidth: 288,
})
