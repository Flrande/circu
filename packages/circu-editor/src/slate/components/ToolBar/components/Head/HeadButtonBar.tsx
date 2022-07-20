import { useAtomValue } from "jotai"
import { activeButtonAtom } from "../../state"
import HeadButton from "./HeadButton"

const HeadButtonBar: React.FC = () => {
  const activeButton = useAtomValue(activeButtonAtom)

  if (activeButton === "head-bar") {
    return (
      <div className={"absolute translate-x-[-46px] -translate-y-16 opacity-100 transition z-50 select-none"}>
        <ul className={"px-2 flex rounded-md border border-solid border-gray-300/20 shadow-lg bg-neutral-800"}>
          <HeadButton headGrade={"4"}></HeadButton>
          <HeadButton headGrade={"5"}></HeadButton>
          <HeadButton headGrade={"6"}></HeadButton>
        </ul>
      </div>
    )
  } else {
    return (
      <div
        style={{
          opacity: "0",
          transform: "translate(-46px, -45px)",
        }}
      ></div>
    )
  }
}

export default HeadButtonBar
