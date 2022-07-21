import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Editor, Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
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
        className={
          "absolute z-[5] flex bg-neutral-800 border border-solid border-zinc-700 rounded-md px-4 py-2 shadow-lg"
        }
        style={{
          left: linkBarState.position.left,
          top: linkBarState.position.top,
        }}
      >
        <div
          className={"h-8 w-[250px] leading-8 text-sm text-slate-50 overflow-hidden text-ellipsis whitespace-nowrap"}
        >
          {linkBarState.url}
        </div>
        <div onClick={onEditButtonClick} className={"w-8 h-8 p-1 ml-[15px] rounded-md hover:bg-neutral-700"}>
          <LinkBarEditIcon></LinkBarEditIcon>
        </div>
        <div onClick={onBreakButtonClick} className={"w-8 h-8 p-1 ml-3 rounded-md hover:bg-neutral-700"}>
          <LinkBarBreakIcon></LinkBarBreakIcon>
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default LinkBar
