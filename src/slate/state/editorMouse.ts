import { atom, useAtom } from "jotai"
import { useEffect } from "react"

export const isEditorMouseUpAtom = atom<boolean>(false)

export const useEditorMouse = () => {
  const [, setIsEditorMouseUp] = useAtom(isEditorMouseUpAtom)

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      setIsEditorMouseUp(true)
    })
    document.addEventListener("mousedown", () => {
      setIsEditorMouseUp(false)
    })
  }, [])
}
