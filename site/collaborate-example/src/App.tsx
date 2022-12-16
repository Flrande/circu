import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Doc from "./doc/Doc"

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <div className={"h-screen overflow-hidden"}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path={"*"} element={<Doc></Doc>}></Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
