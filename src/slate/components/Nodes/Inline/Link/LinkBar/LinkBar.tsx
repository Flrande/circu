import { useAtom, useAtomValue } from "jotai"
import { linkBarBreakIconContainer, linkBarContainer, linkBarEditIconContainer, linkBarUrlContainer } from "../Link.css"
import {
  isLinkBarActiveDerivedAtom,
  isLinkEditBarActiveAtom,
  isMouseEnterLinkBarOnceAtom,
  linkBarStateAtom,
  linkEditBarStateDerivedAtom,
  linkStateDerivedAtom,
} from "../state"
import LinkBarBreakIcon from "./LinkBarBreakIcon"
import LinkBarEditIcon from "./LinkBarEditIcon"

const LinkBar: React.FC = () => {
  const [isLinkBarActive, setIsLinkBarActiveDerived] = useAtom(isLinkBarActiveDerivedAtom)
  const [, setIsMouseEnterLinkBarOnce] = useAtom(isMouseEnterLinkBarOnceAtom)
  const [, setIsLinkEditBarActive] = useAtom(isLinkEditBarActiveAtom)

  const [, setLinkEditBarStateDerived] = useAtom(linkEditBarStateDerivedAtom)
  const linkState = useAtomValue(linkStateDerivedAtom)
  const linkBarState = useAtomValue(linkBarStateAtom)

  const onClickEditButton: React.MouseEventHandler<HTMLDivElement> = () => {
    setIsLinkBarActiveDerived({
      type: "instant",
      value: false,
    })
    setLinkEditBarStateDerived(linkState)
    setIsLinkEditBarActive(true)
  }

  if (isLinkBarActive && linkBarState) {
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
        <div onClick={onClickEditButton} className={linkBarEditIconContainer}>
          <LinkBarEditIcon></LinkBarEditIcon>
        </div>
        <div
          //TODO: 清除 link
          className={linkBarBreakIconContainer}
        >
          <LinkBarBreakIcon></LinkBarBreakIcon>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkBar
