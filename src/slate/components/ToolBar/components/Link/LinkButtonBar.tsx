import { atom, useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { useSlateStatic } from "slate-react"
import { toggleLink } from "../../../Nodes/Inline/Link/linkHelper"
import { linkButtonBarButton, linkButtonBarContainer, linkButtonBarInput, linkButtonBarSpan } from "./LinkButtonBar.css"

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
        className={linkButtonBarContainer}
        style={{
          left: linkButtonBarState.position.left,
          top: linkButtonBarState.position.top,
        }}
      >
        <span className={linkButtonBarSpan}>链接</span>
        <input
          ref={linkInputDom}
          value={url}
          placeholder={"粘贴或输入一个链接"}
          onChange={(event) => {
            setUrl(event.target.value)
          }}
          className={linkButtonBarInput}
        />
        <button onClick={onClick} className={linkButtonBarButton}>
          确定
        </button>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkButtonBar
