import type { CustomText } from "../types/interface"

export interface LeafProps {
  attributes: { [key: string]: any }
  leaf: CustomText
}

const Leaf: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  } else if (leaf.code) {
    children = <code>{children}</code>
  }

  return <span {...attributes}>{children}</span>
}

export default Leaf
