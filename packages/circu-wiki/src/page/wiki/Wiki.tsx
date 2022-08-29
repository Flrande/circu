import WikiEditor from "./components/WikiEditor/WikiEditor"
import WikiSidebar from "./components/WikiSdeBar/WikiSidebar"

const Wiki: React.FC = () => {
  return (
    <div className={"flex h-full w-full bg-neutral-900"}>
      <WikiSidebar></WikiSidebar>
      <WikiEditor></WikiEditor>
    </div>
  )
}

export default Wiki
