const Bold: React.FC = ({ children }) => {
  return (
    <span
      style={{
        fontWeight: "700",
      }}
    >
      {children}
    </span>
  )
}

export default Bold
