import { useAtomValue } from "jotai"
import { activeButtonAtom } from "../../state"
import { headButtonBarContainer, headButtonBarList } from "./Head.css"
import HeadButton from "./HeadButton"

const HeadButtonBar: React.FC = () => {
  const activeButton = useAtomValue(activeButtonAtom)

  if (activeButton === "head-bar") {
    return (
      <div className={headButtonBarContainer}>
        <ul className={headButtonBarList}>
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
