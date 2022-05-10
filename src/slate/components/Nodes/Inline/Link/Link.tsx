import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { SlateNode } from "../../../../types/slate"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { linkContainer } from "./Link.css"
import { isLinkBarActiveDerivedAtom, linkStateDerivedAtom } from "./state"
import type { ILink } from "./types"

const Link: React.FC<CustomRenderElementProps<ILink>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()

  const [, setIsLinkBarActiveDerived] = useAtom(isLinkBarActiveDerivedAtom)

  const [, setLinkStateDerived] = useAtom(linkStateDerivedAtom)

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

      // 文档左右两边到视口的距离, 790 为文档宽度
      const docXPadding = (document.documentElement.clientWidth - 790) / 2
      const top = window.scrollY + linkDom.getBoundingClientRect().top + 28
      const left = window.scrollX + linkDom.getBoundingClientRect().left - docXPadding
      setLinkStateDerived({
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
          //TODO: 加个跳转失败的弹窗?
          const newTab = window.open(element.url, "_blank")
        }}
        href={element.url}
        className={linkContainer}
      >
        {children}
      </a>
    </span>
  )
}

export default Link
