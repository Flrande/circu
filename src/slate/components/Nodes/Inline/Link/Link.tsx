import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { ReactEditor, useSlate } from "slate-react"
import { SlateNode } from "../../../../types/slate"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { linkContainer } from "./Link.css"
import { isLinkBarActiveDerivedAtom, linkStateDerivedAtom } from "./state"
import type { ILink } from "./types"

const Link: React.FC<CustomRenderElementProps<ILink>> = ({ attributes, children, element }) => {
  const editor = useSlate()

  const [, setIsLinkBarActiveDerived] = useAtom(isLinkBarActiveDerivedAtom)

  const [, setLinkStateDerived] = useAtom(linkStateDerivedAtom)

  const [linkDom, setLinkDom] = useState<HTMLElement>()

  const onMouseEnter: React.MouseEventHandler<HTMLAnchorElement> = () => {
    if (linkDom) {
      setIsLinkBarActiveDerived({
        type: "instant",
        value: true,
      })

      const top = window.scrollY + linkDom.getBoundingClientRect().top + 28
      const left = window.scrollX + linkDom.getBoundingClientRect().left
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
