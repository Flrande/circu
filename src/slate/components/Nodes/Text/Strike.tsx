const Strike: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
