import { proxy } from "valtio"

export type drivePageSignal = "home" | "me" | "shared" | "favorites" | "wiki" | "trash"

export const driverStateStore = proxy<{
  currentPage: drivePageSignal
  sidebarWidth: number
}>({
  currentPage: "home",
  sidebarWidth: 288,
})
