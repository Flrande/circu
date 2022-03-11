import type { CustomText } from "../../../types/interface"
import Bold from "./Bold"

export interface LeafProps {
  attributes: { [key: string]: any }
  leaf: CustomText
}

const Leaf: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <Bold>{children}</Bold>
  }

  return (
    // 用于解决行内元素在行尾(后面实际还有一个空的 text)时光标无法选择至 text 的问题
    <span {...attributes} style={leaf.text === "" ? { paddingLeft: "0.1px" } : undefined}>
      {children}
    </span>
  )
}

export default Leaf
