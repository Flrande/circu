const Bold: React.FC = ({ children }) => {
  return (
    <span
      style={{
        fontWeight: "600",
      }}
    >
      {children}
    </span>
  )
}

export default Bold
