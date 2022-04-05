const Strike: React.FC = ({ children }) => {
  return (
    <span
      style={{
        textDecoration: "line-through",
      }}
    >
      {children}
    </span>
  )
}

export default Strike
