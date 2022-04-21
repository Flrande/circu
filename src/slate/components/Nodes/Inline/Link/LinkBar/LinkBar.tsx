import { useAtom, useAtomValue } from "jotai"
import { Editor, Transforms } from "slate"
import { useSlate } from "slate-react"
import { linkBarBreakIconContainer, linkBarContainer, linkBarEditIconContainer, linkBarUrlContainer } from "../Link.css"
import {
  isLinkBarActiveDerivedAtom,
  isLinkEditBarActiveAtom,
  isMouseEnterLinkBarOnceAtom,
  linkBarStateAtom,
  linkEditBarStateDerivedAtom,
} from "../state"
import LinkBarBreakIcon from "./LinkBarBreakIcon"
import LinkBarEditIcon from "./LinkBarEditIcon"

const LinkBar: React.FC = () => {
  const editor = useSlate()

  const [isLinkBarActive, setIsLinkBarActiveDerived] = useAtom(isLinkBarActiveDerivedAtom)
  const [, setIsMouseEnterLinkBarOnce] = useAtom(isMouseEnterLinkBarOnceAtom)
  const [, setIsLinkEditBarActive] = useAtom(isLinkEditBarActiveAtom)

  const [, setLinkEditBarStateDerived] = useAtom(linkEditBarStateDerivedAtom)
  const linkBarState = useAtomValue(linkBarStateAtom)

  if (isLinkBarActive && linkBarState) {
    const onEditButtonClick: React.MouseEventHandler<HTMLDivElement> = () => {
      setIsLinkBarActiveDerived({
        type: "instant",
        value: false,
      })
      setLinkEditBarStateDerived()
      setIsLinkEditBarActive(true)
    }

    // 2022-4-21
    // 使用 onClick 似乎会导致 editor.selection 修改后与 原生 selection 不同步
    // 暂未找到解决办法
    //TODO-BUG: 连续清除多个链接时, 主工具栏的位置基于上一个链接
    const onBreakButtonMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
      event.preventDefault()
      event.stopPropagation()
      const linkPath = linkBarState.linkElementPath
      const rangeRef = Editor.rangeRef(editor, Editor.range(editor, linkPath))

      Transforms.unwrapNodes(editor, {
        at: linkPath,
      })
      if (rangeRef.current) {
        Transforms.select(editor, rangeRef.current)
      }
      setIsLinkBarActiveDerived({
        type: "instant",
        value: false,
      })

      rangeRef.unref()
    }

    return (
      <div
        onMouseEnter={() => {
          setIsMouseEnterLinkBarOnce(true)
        }}
        onMouseLeave={() => {
          setIsLinkBarActiveDerived({
            type: "instant",
            value: false,
          })
          setIsMouseEnterLinkBarOnce(false)
        }}
        className={linkBarContainer}
        style={{
          left: linkBarState.position.left,
          top: linkBarState.position.top,
        }}
      >
        <div className={linkBarUrlContainer}>{linkBarState.url}</div>
        <div onClick={onEditButtonClick} className={linkBarEditIconContainer}>
          <LinkBarEditIcon></LinkBarEditIcon>
        </div>
        <div onMouseDown={onBreakButtonMouseDown} className={linkBarBreakIconContainer}>
          <LinkBarBreakIcon></LinkBarBreakIcon>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkBar
