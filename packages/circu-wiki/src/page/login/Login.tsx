import loginPageBgUrl from "./global-bg.jpg"
import logoUrl from "../../styles/logo.png"
import { CheckSmall, GithubOne } from "@icon-park/react"
import { useMutation } from "@tanstack/react-query"
import { login, LoginData, LoginError, LoginProps } from "../../server/login"
import { proxy, useSnapshot } from "valtio"
import { Message, Spin } from "@arco-design/web-react"

type LoginStateStore = {
  loginPayload: LoginProps
}

const loginStateStore = proxy<LoginStateStore>({
  loginPayload: {
    username: "",
    password: "",
    options: {
      ifCarrySession: false,
    },
  },
})

const Login: React.FC = () => {
  const loginStateSnap = useSnapshot(loginStateStore)

  const loginMutation = useMutation<LoginData, LoginError, LoginProps>({
    mutationFn: ({ username, password, options }) => login(username, password, options),
    onError: () => {
      //TODO: 错误码处理
      Message.error({
        content: "登录失败, 请重试.",
        className: "rounded-md",
      })
    },
    onSuccess: () => {
      Message.info({
        icon: <Spin></Spin>,
        content: "登录成功, 跳转中, 请稍等.",
        className: "rounded-md",
      })

      //TODO: 主页跳转
    },
  })

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
          backdropFilter: "blur(2px)",
        }}
      ></div>
      <div className={"relative h-full w-full grid py-14 px-44 grid-rows-[80px_minmax(600px,1fr)]"}>
        <div className={"grid grid-cols-[64px_160px_1fr]"}>
          <div className={"grid justify-center items-end mb-2"}>
            <img src={`${logoUrl}`} alt={"logo"} className={"w-12 h-12"}></img>
          </div>
          <div className={"grid items-end"}>
            <span className={"text-[38px] font-medium ml-2 text-gray-800"}>Circu</span>
          </div>
          <div className={"grid grid-cols-[22px_22px] items-end text-[20px] font-medium ml-2 mb-1 text-gray-800"}>
            <GithubOne
              className={"mb-1"}
              theme="filled"
              size="20"
              fill="#212936"
              strokeLinejoin="bevel"
              strokeLinecap="square"
            />
            <span>Github</span>
          </div>
        </div>
        <div className={"p-5 grid justify-center"}>
          <div className={"w-[520px] h-full grid grid-rows-[95px_repeat(2,105px)_54px_72px_72px]"}>
            <div className={"text-[35px] font-medium grid items-end justify-center mb-2 text-white"}>
              <span>登录</span>
            </div>
            <div className={"grid grid-rows-[32px_1fr] px-2 py-3"}>
              <div className={"text-xl text-white"}>邮箱或用户名</div>
              <div className={"py-1"}>
                <input
                  onChange={(event) => {
                    loginStateStore.loginPayload.username = event.target.value
                  }}
                  type={"text"}
                  className="w-full h-full px-3 text-lg text-white rounded-md bg-[#343435] hover:bg-[#3e3e3f] focus:bg-[#232324] focus:border border-[#467cab]"
                ></input>
              </div>
            </div>
            <div className={"grid grid-rows-[32px_1fr] px-2 py-3"}>
              <div className={"text-xl text-white"}>密码</div>
              <div className={"py-1"}>
                <input
                  onChange={(event) => {
                    loginStateStore.loginPayload.password = event.target.value
                  }}
                  type={"text"}
                  className="w-full h-full px-3 text-lg text-white rounded-md bg-[#343435] hover:bg-[#3e3e3f] focus:bg-[#232324] focus:border border-[#467cab]"
                ></input>
              </div>
            </div>
            <div className={"grid grid-cols-[340px_1fr] px-2 py-3"}>
              <div className={"grid grid-cols-[32px_1fr] items-center"}>
                <div
                  onClick={() => {
                    loginStateStore.loginPayload.options.ifCarrySession =
                      !loginStateStore.loginPayload.options.ifCarrySession
                  }}
                  className={"w-5 h-5 rounded-md bg-[#343435] hover:bg-[#3e3e3f] border-[#467cab] cursor-pointer"}
                >
                  {loginStateSnap.loginPayload.options.ifCarrySession && (
                    <CheckSmall theme="filled" size="20" fill="#ffffff" strokeLinejoin="bevel" strokeLinecap="square" />
                  )}
                </div>
                <div className={"text-xl text-white"}>
                  <span>7天内免登录</span>
                </div>
              </div>
              <div className={"text-xl text-[#7d7c7e] hover:text-[#9f9ea0] cursor-pointer"}>
                <span>忘记密码</span>
              </div>
            </div>
            <div className={"px-2 py-3"}>
              <div
                onClick={() => {
                  loginMutation.mutate(loginStateStore.loginPayload)
                }}
                className={
                  "w-full h-full rounded-md bg-[#416ef6] hover:bg-[#467cab] grid justify-center items-center text-xl text-white cursor-pointer"
                }
              >
                <span>登录</span>
              </div>
            </div>
            <div className={"px-2 py-3"}>
              <div
                className={
                  "w-full h-full rounded-md bg-[#343435] hover:bg-[#3e3e3f] grid justify-center items-center text-xl text-white cursor-pointer"
                }
              >
                <span>注册</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
