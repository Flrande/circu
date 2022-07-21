import { useAtom, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Transforms } from "slate"
import { useSlateStatic } from "slate-react"
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
        className={"absolute z-[5] bg-neutral-800 border border-solid border-zinc-700 rounded-md px-4 py-2 shadow-lg"}
        style={{
          left: linkEditBarState.position.left,
          top: linkEditBarState.position.top,
        }}
      >
        <div
          className={"text-slate-50 text-sm"}
          style={{
            marginBottom: "6px",
          }}
        >
          <span className={"text-right mr-3"}>文本</span>
          <input
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
            className={
              "h-8 w-[250px] leading-8 pl-3 rounded-md border border-solid border-zinc-700 bg-neutral-800 text-slate-50 text-sm"
            }
          ></input>
        </div>

        <div className={"text-slate-50 text-sm"}>
          <span className={"text-right mr-3"}>链接</span>
          <input
            ref={linkInputDom}
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
            }}
            className={
              "h-8 w-[250px] leading-8 pl-3 rounded-md border border-solid border-zinc-700 bg-neutral-800 text-slate-50 text-sm"
            }
            style={{
              marginRight: "16px",
            }}
          ></input>
          <button
            onClick={onButtonClick}
            className={"w-[68px] h-8 text-slate-50 border-none bg-blue-500 rounded-md text-sm cursor-pointer"}
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
