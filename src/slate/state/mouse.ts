import { atom, useAtom } from "jotai"
import { useEffect } from "react"

// 用于控制主工具栏
export const isMouseUpAtom = atom<boolean>(false)

export const useMouse = () => {
  const [, setIsMouseUp] = useAtom(isMouseUpAtom)

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      setIsMouseUp(true)
    })
    document.addEventListener("mousedown", () => {
      setIsMouseUp(false)
    })
  }, [])
}
