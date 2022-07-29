const DragMarkLine: React.FC<{
  activeDirection: "top" | "bottom" | null
}> = ({ activeDirection }) => {
  return (
    <div
      contentEditable={false}
      style={{
        position: "absolute",
        borderTop: activeDirection ? "2px solid #0034ae" : undefined,
        width: "100%",
        top: activeDirection === "top" ? "-2px" : undefined,
        bottom: activeDirection === "bottom" ? "0px" : undefined,
      }}
    ></div>
  )
}

export default DragMarkLine
