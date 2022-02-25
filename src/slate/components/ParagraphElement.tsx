export interface ParagraphElementProps {
  attributes: { [key: string]: any }
}

const ParagraphElement: React.FC<ParagraphElementProps> = ({ attributes, children }) => {
  return <p {...attributes}>{children}</p>
}

export default ParagraphElement
