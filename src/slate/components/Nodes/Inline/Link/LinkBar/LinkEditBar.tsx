import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Transforms } from "slate"
import { useSlate } from "slate-react"
import { isLinkEditBarActiveAtom, linkEditBarStateDerivedAtom, linkStateDerivedAtom } from "../state"
import type { ILink } from "../types"

const LinkEditBar: React.FC = () => {
  const editor = useSlate()

  const [isLinkEditBarActive, setIsLinkEditBarActive] = useAtom(isLinkEditBarActiveAtom)

  const [linkEditBarState, setLinkEditBarStateDerived] = useAtom(linkEditBarStateDerivedAtom)
  const [, setLinkStateDerived] = useAtom(linkStateDerivedAtom)

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
      console.log(text, url, linkEditBarState.linkElementPath)
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
      setLinkStateDerived({
        text: text,
        url: url,
        linkElementPath: linkEditBarState.linkElementPath,
        position: linkEditBarState.position,
      })
      setLinkEditBarStateDerived()
    }

    return (
      <div
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsLinkEditBarActive(false)
          }
        }}
        tabIndex={-1}
        style={{
          position: "absolute",
          zIndex: "5",
          backgroundColor: "#292929",
          border: "1px solid #3c3c3c",
          borderRadius: "6px",
          padding: "8px 16px",
          boxShadow: "0 3px 12px 0 rga(0, 0, 0, 0.28)",
          left: linkEditBarState.position.left,
          top: linkEditBarState.position.top,
        }}
      >
        <div
          style={{
            color: "#ebebeb",
            fontSize: "14px",
            lineHeight: "1.5",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              textAlign: "right",
              marginRight: "12px",
            }}
          >
            文本
          </span>
          <input
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
            style={{
              height: "32px",
              width: "250px",
              lineHeight: "32px",
              paddingLeft: "12px",
              borderRadius: "6px",
              border: "1px solid #464646",
              backgroundColor: "#292929",
              color: "#ebebeb",
              fontSize: "14px",
            }}
          ></input>
        </div>

        <div
          style={{
            color: "#ebebeb",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          <span
            style={{
              textAlign: "right",
              marginRight: "12px",
            }}
          >
            链接
          </span>
          <input
            ref={linkInputDom}
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
            }}
            style={{
              height: "32px",
              width: "250px",
              lineHeight: "32px",
              paddingLeft: "12px",
              borderRadius: "6px",
              border: "1px solid #464646",
              backgroundColor: "#292929",
              color: "#ebebeb",
              fontSize: "14px",
              marginRight: "16px",
            }}
          ></input>
          <button
            onClick={onButtonClick}
            style={{
              width: "68px",
              height: "32px",
              color: "#ebebeb",
              border: "none",
              backgroundColor: "#5a87f7",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
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
