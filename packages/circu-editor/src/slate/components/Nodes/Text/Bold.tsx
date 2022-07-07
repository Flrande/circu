import type React from "react"

const Bold: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
