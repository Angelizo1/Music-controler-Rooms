import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomJoinPage from "./pages/RoomJoinPage";
import { Room } from "./pages/Room";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data/")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<h5>{data ? data.message : "Loading..."}</h5>} />
      <Route path="/join" element={<RoomJoinPage />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/room/:roomCode" element={<Room />} />
    </Routes>
  );
}

export default App;
