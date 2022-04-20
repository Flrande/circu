import { useAtom, useAtomValue } from "jotai"
import { useState } from "react"
import {
  isLinkBarActiveDerivedAtom,
  isLinkEditBarActiveAtom,
  isMouseEnterLinkBarOnce,
  linkBarStateAtom,
  linkEditBarStateDerivedAtom,
  linkStateDerivedAtom,
} from "../state"
import LinkBarBreakIcon from "./LinkBarBreakIcon"
import LinkBarEditIcon from "./LinkBarEditIcon"

const LinkBar: React.FC = () => {
  const [isLinkBarActive, setIsLinkBarActiveDerived] = useAtom(isLinkBarActiveDerivedAtom)
  const [, setIsMouseEnterLinkBarOnce] = useAtom(isMouseEnterLinkBarOnce)
  const [, setIsLinkEditBarActive] = useAtom(isLinkEditBarActiveAtom)

  const [, setLinkEditBarStateDerived] = useAtom(linkEditBarStateDerivedAtom)
  const linkState = useAtomValue(linkStateDerivedAtom)
  const linkBarState = useAtomValue(linkBarStateAtom)

  //TODO-BUG: 用伪类替代, 现在的实现冗余且有 bug (setIsLinkEditBarActive 后会暂留)
  const [isMouseEnterEditButton, setIsMouseEnterEditButton] = useState(false)
  const [isMouseEnterBreakButton, setIsMouseEnterBreakButton] = useState(false)

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
        style={{
          position: "absolute",
          zIndex: "5",
          display: "flex",
          backgroundColor: "#292929",
          border: "1px solid #3c3c3c",
          borderRadius: "6px",
          padding: "8px 16px",
          boxShadow: "drop-shadow(0px 8px 16px rgba(0,0,0,0.28))",
          left: linkBarState.position.left,
          top: linkBarState.position.top,
        }}
      >
        <div
          style={{
            height: "32px",
            width: "250px",
            lineHeight: "32px",
            fontSize: "14px",
            color: "#ebebeb",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {linkBarState.url}
        </div>
        <div
          onClick={onClickEditButton}
          onMouseEnter={() => {
            setIsMouseEnterEditButton(true)
          }}
          onMouseLeave={() => {
            setIsMouseEnterEditButton(false)
          }}
          style={{
            width: "32px",
            height: "32px",
            padding: "4px",
            marginLeft: "15px",
            borderRadius: "6px",
            backgroundColor: isMouseEnterEditButton ? "#3d3d3d" : undefined,
          }}
        >
          <LinkBarEditIcon></LinkBarEditIcon>
        </div>
        <div
          //TODO: 清除 link
          onMouseEnter={() => {
            setIsMouseEnterBreakButton(true)
          }}
          onMouseLeave={() => {
            setIsMouseEnterBreakButton(false)
          }}
          style={{
            width: "32px",
            height: "32px",
            padding: "4px",
            marginLeft: "12px",
            borderRadius: "6px",
            backgroundColor: isMouseEnterBreakButton ? "#3d3d3d" : undefined,
          }}
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
