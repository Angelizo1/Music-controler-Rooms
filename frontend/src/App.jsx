import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomJoinPage from "./pages/RoomJoinPage";
import { Room } from "./pages/Room";
import {
  TextField,
  Button,
  Grid,
  Typography,
  ButtonGroup,
} from "@mui/material";

import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(null);

  const getUserInRoom = async () => {
    try {
      const resp = await fetch(`http://127.0.0.1:8000/api/user-in-room/`, {
        credentials: "include",
      });
      const data = await resp.json();
      setUserId(data.code);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getUserInRoom();
  }, []);
  const HomePage = () => {
    return (
      <Grid container spacing={3} direction="column">
        <Grid columns={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid columns={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={userId ? <Navigate to={`/room/${userId}`} /> : <HomePage />}
      />
      <Route path="/join" element={<RoomJoinPage />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/room/:roomCode" element={<Room />} />
    </Routes>
  );
}

export default App;
