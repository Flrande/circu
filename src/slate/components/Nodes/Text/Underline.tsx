const Underline: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <span
      style={{
        textDecoration: "underline",
      }}
    >
      {children}
    </span>
  )
}

export default Underline
