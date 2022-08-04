const DragMarkLine: React.FC<{
  activeDirection: "top" | "bottom" | null
}> = ({ activeDirection }) => {
  return (
    <div
      contentEditable={false}
      style={{
        position: "absolute",
        borderTop: activeDirection ? "4px solid #052F78" : undefined,
        width: "100%",
        top: activeDirection === "top" ? "-2px" : undefined,
        bottom: activeDirection === "bottom" ? "0px" : undefined,
        userSelect: "none",
      }}
    ></div>
  )
}

export default DragMarkLine
