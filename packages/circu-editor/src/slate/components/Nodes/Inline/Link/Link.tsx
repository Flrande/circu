import { useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { DOC_WIDTH } from "../../../../types/constant"
import { SlateNode } from "../../../../types/slate"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { isLinkBarActiveDerivedAtom, linkStateAtom } from "./state"
import type { ILink } from "./types"

const Link: React.FC<CustomRenderElementProps<ILink>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()

  const setIsLinkBarActiveDerived = useSetAtom(isLinkBarActiveDerivedAtom)

  const setLinkState = useSetAtom(linkStateAtom)

  const [linkDom, setLinkDom] = useState<HTMLElement>()
  const timeoutId = useRef<number | null>(null)

  const onMouseEnter: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (linkDom) {
      // 计时, 若用户 800 毫秒内没有离开 link, 触发 linkBar
      timeoutId.current = window.setTimeout(() => {
        setIsLinkBarActiveDerived({
          type: "instant",
          value: true,
        })
      }, 800)

      // 文档左右两边到视口的距离
      const docXPadding = (document.documentElement.clientWidth - DOC_WIDTH) / 2
      const top = window.scrollY + linkDom.getBoundingClientRect().top + 28
      const left = window.scrollX + linkDom.getBoundingClientRect().left - docXPadding
      setLinkState({
        text: SlateNode.string(element),
        url: element.url,
        linkElementPath: ReactEditor.findPath(editor, element),
        position: {
          top,
          left,
        },
      })
    }
  }

  const onMouseLeave: React.MouseEventHandler<HTMLAnchorElement> = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }
    setIsLinkBarActiveDerived({
      type: "delayed",
      value: false,
    })
  }

  useEffect(() => {
    setLinkDom(ReactEditor.toDOMNode(editor, element))
  })

  return (
    <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...attributes}>
      <a
        onClick={() => {
          const newTab = window.open(element.url, "_blank")
        }}
        href={element.url}
        className={"cursor-pointer text-blue-500 no-underline hover:underline"}
      >
        {children}
      </a>
    </span>
  )
}

export default Link
