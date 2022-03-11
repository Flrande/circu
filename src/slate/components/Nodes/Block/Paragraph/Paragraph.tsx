export interface ParagraphProps {
  attributes: { [key: string]: any }
}

const Paragraph: React.FC<ParagraphProps> = ({ attributes, children }) => {
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

export default Paragraph
