import { Navigate, Route, Routes } from "react-router"
import ChatRoomPage from "../../pages/chat-room"
import RoomListPage from "../../pages/room-list"
import CreateRoomPage from "../../pages/create-room"
import Navbar from "./navbar"

const Dashboard = () => {
  return (
    <section className="chat-app" style={{color: 'white'}}>
      <Navbar/>
      <Routes>
        <Route index element={<ChatRoomPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </section>
  )
}

export default Dashboard