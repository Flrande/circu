const Italic: React.FC = ({ children }) => {
  return (
    <span
      style={{
        fontStyle: "italic",
      }}
    >
      {children}
    </span>
  )
}

export default Italic
