import { useAtom, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import {
  linkEditBarButton,
  linkEditBarContainer,
  linkEditBarRow,
  linkEditBarRowInput,
  linkEditBarSpan,
} from "../Link.css"
import { isLinkEditBarActiveAtom, linkEditBarStateDerivedAtom, linkStateAtom } from "../state"
import type { ILink } from "../types"

const LinkEditBar: React.FC = () => {
  const editor = useSlateStatic()

  const [isLinkEditBarActive, setIsLinkEditBarActive] = useAtom(isLinkEditBarActiveAtom)

  const [linkEditBarState, setLinkEditBarStateDerived] = useAtom(linkEditBarStateDerivedAtom)
  const setLinkState = useSetAtom(linkStateAtom)

  const [text, setText] = useState("")
  const [url, setUrl] = useState("")
  const linkInputDom = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (linkInputDom.current && isLinkEditBarActive) {
      linkInputDom.current.focus()
    }
    if (linkEditBarState) {
      setText(linkEditBarState.text)
      setUrl(linkEditBarState.url)
    }
  }, [isLinkEditBarActive, linkEditBarState])

  if (isLinkEditBarActive && linkEditBarState) {
    const onButtonClick = () => {
      Transforms.setNodes<ILink>(
        editor,
        {
          url: url,
        },
        {
          at: linkEditBarState.linkElementPath,
        }
      )
      Transforms.insertText(editor, text, {
        at: linkEditBarState.linkElementPath,
      })
      // 同步
      // linkState -> linkEditBar 对应的 link
      // LinkEditBarState -> linkState
      setLinkState({
        text: text,
        url: url,
        linkElementPath: linkEditBarState.linkElementPath,
        position: linkEditBarState.position,
      })
      setLinkEditBarStateDerived()
      setIsLinkEditBarActive(false)
    }

    return (
      <div
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsLinkEditBarActive(false)
          }
        }}
        tabIndex={-1}
        className={linkEditBarContainer}
        style={{
          left: linkEditBarState.position.left,
          top: linkEditBarState.position.top,
        }}
      >
        <div
          className={linkEditBarRow}
          style={{
            marginBottom: "6px",
          }}
        >
          <span className={linkEditBarSpan}>文本</span>
          <input
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
            className={linkEditBarRowInput}
          ></input>
        </div>

        <div className={linkEditBarRow}>
          <span className={linkEditBarSpan}>链接</span>
          <input
            ref={linkInputDom}
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
            }}
            className={linkEditBarRowInput}
            style={{
              marginRight: "16px",
            }}
          ></input>
          <button onClick={onButtonClick} className={linkEditBarButton}>
            确定
          </button>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkEditBar
