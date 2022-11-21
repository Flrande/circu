import loginPageBgUrl from "./global-bg.jpg"

const Login: React.FC = () => {
  return (
    <div
      className={"h-full w-full bg-cover bg-center"}
      style={{
        backgroundImage: `url(${loginPageBgUrl})`,
      }}
    >
      <div
        className={"h-full w-full absolute"}
        style={{
          background: "linear-gradient(68deg, rgba(40,42,54,1) 0%, rgba(40,42,54,1) 55%, rgba(40,42,54,0.65) 100%)",
        }}
      ></div>
      <div className={"h-full w-full grid p-12 grid-rows-[80px_minmax(600px,1fr)]"}>
        <div className={"grid grid-cols-[56px_160px_1fr]"}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={"p-5"}>
          <div className={"w-[520px] h-full grid grid-rows-[105px_repeat(2,95px)_repeat(4,64px)]"}>
            <div></div>
            <div className={"grid grid-rows-[32px_1fr]"}>
              <div></div>
              <div></div>
            </div>
            <div className={"grid grid-rows-[32px_1fr]"}>
              <div></div>
              <div></div>
            </div>
            <div className={"grid grid-cols-[340px_1fr]"}>
              <div></div>
              <div></div>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
