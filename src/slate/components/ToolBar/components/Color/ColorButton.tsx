import ColorIcon from "./ColorIcon"

const ColorButton: React.FC = () => {
  return (
    <div>
      <div
        style={{
          padding: "8px 4px",
        }}
      >
        <div
          style={{
            height: "24px",
            width: "24px",
          }}
        >
          <ColorIcon></ColorIcon>
        </div>
      </div>
    </div>
  )
}

export default ColorButton
