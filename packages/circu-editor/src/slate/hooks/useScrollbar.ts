import { useEffect } from "react"

export const useScrollBar = () => {
  useEffect(() => {
    const doms = [...document.querySelectorAll(".os-scrollbar"), ...document.querySelectorAll(".os-size-observer")]

    for (const dom of doms) {
      dom.setAttribute("contenteditable", "false")
    }
  })
}
