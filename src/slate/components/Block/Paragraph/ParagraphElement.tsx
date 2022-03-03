export interface ParagraphElementProps {
  attributes: { [key: string]: any }
}

const ParagraphElement: React.FC<ParagraphElementProps> = ({ attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{
        margin: "8px 0",
      }}
    >
      {children}
    </div>
  )
}

export default ParagraphElement
