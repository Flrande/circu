import { atom, useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { useSlateStatic } from "slate-react"
import { toggleLink } from "../../../Nodes/Inline/Link/linkHelper"

export const linkButtonBarStateAtom = atom<{
  isActive: boolean
  position: {
    left: number
    top: number
  } | null
}>({
  isActive: false,
  position: null,
})

const LinkButtonBar: React.FC = () => {
  const editor = useSlateStatic()

  const [linkButtonBarState, setLinkButtonBarState] = useAtom(linkButtonBarStateAtom)

  const [url, setUrl] = useState("")
  const linkInputDom = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (linkInputDom.current && linkButtonBarState.isActive) {
      linkInputDom.current.focus()
    }
    if (!linkButtonBarState.isActive) {
      setUrl("")
    }
  }, [linkButtonBarState.isActive])

  if (linkButtonBarState.isActive && linkButtonBarState.position) {
    const onClick = () => {
      toggleLink(editor, url)
      setLinkButtonBarState({
        isActive: false,
        position: null,
      })
    }

    return (
      <div
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setLinkButtonBarState({
              isActive: false,
              position: null,
            })
          }
        }}
        tabIndex={-1}
        className={
          "absolute z-[5] bg-zinc-800 border border-solid border-gray-900 rounded-md py-3 px-4 shadow-lg flex items-center"
        }
        style={{
          left: linkButtonBarState.position.left,
          top: linkButtonBarState.position.top,
        }}
      >
        <span className={"text-right mr-3 w-9"}>链接</span>
        <input
          ref={linkInputDom}
          value={url}
          placeholder={"粘贴或输入一个链接"}
          onChange={(event) => {
            setUrl(event.target.value)
          }}
          className={
            "h-8 w-[250px] leading-8 pl-3 rounded-md border border-solid border-blue-500 bg-zinc-900 text-sm mr-3 placeholder:text-gray-700"
          }
        />
        <button onClick={onClick} className={"w-[68px] h-8 rounded-md bg-blue-500 text-sm cursor-pointer"}>
          确定
        </button>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkButtonBar
