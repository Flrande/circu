const Italic: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
