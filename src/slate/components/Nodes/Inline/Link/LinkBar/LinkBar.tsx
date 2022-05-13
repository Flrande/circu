import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Editor, Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
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
  const editor = useSlateStatic()

  const [isLinkBarActive, setIsLinkBarActiveDerived] = useAtom(isLinkBarActiveDerivedAtom)
  const setIsMouseEnterLinkBarOnce = useSetAtom(isMouseEnterLinkBarOnceAtom)
  const setIsLinkEditBarActive = useSetAtom(isLinkEditBarActiveAtom)

  const setLinkEditBarStateDerived = useSetAtom(linkEditBarStateDerivedAtom)
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

    const onBreakButtonClick: React.MouseEventHandler<HTMLDivElement> = () => {
      const linkPath = linkBarState.linkElementPath
      const rangeRef = Editor.rangeRef(editor, Editor.range(editor, linkPath))

      Transforms.unwrapNodes(editor, {
        at: linkPath,
      })
      if (rangeRef.current) {
        ReactEditor.focus(editor)
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
        <div onClick={onBreakButtonClick} className={linkBarBreakIconContainer}>
          <LinkBarBreakIcon></LinkBarBreakIcon>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkBar
