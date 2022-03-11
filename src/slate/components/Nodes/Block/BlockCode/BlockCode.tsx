import { BlockCodeConntainer } from "./BlockCode.css"

export interface BlockCodeProps {
  attributes: { [key: string]: any }
}

const BlockCode: React.FC<BlockCodeProps> = ({ attributes, children }) => {
  return (
    <div {...attributes} className={BlockCodeConntainer}>
      <pre>{children}</pre>
    </div>
  )
}

export default BlockCode
