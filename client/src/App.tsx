import { Navigate, Route, Routes } from "react-router-dom"
import RegisterPage from "./pages/Register"
import LoginPage from "./pages/Login"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import NavBar from "./components/NavBar"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import ChatPage from "./pages/Chat"
import { ChatContextProvider } from "./context/ChatContext"

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container className="text-white">
        <Routes>
          <Route path="/" element={user?._id ? <ChatPage /> : <LoginPage />} />
          <Route path="/register" element={user?._id ? <ChatPage /> : <RegisterPage />} />
          <Route path="/login" element={user?._id ? <ChatPage /> : <LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  )
}

export default App
