import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Grid, Typography } from "@mui/material";
const RoomJoinPage = () => {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleEnterRoomCode = (e) => {
    setRoomCode(e.target.value);
  };

  const roomButtonPressed = () => {
    console.log("roomCode", roomCode);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
      credentials: "include",
    };
    fetch("http://127.0.0.1:8000/api/join-room/", requestOptions)
      .then((res) => {
        if (res.ok) {
          console.log("res", res);
          navigate(`/room/${roomCode}`);
        } else {
          setError("Room not Found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item columns={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item columns={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleEnterRoomCode}
        ></TextField>
      </Grid>
      <Grid item columns={12} align="center">
        <Button
          variant="contained"
          color="primary"
          to="/"
          onClick={roomButtonPressed}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item columns={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          to="/"
          LinkComponent={Link}
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default RoomJoinPage;
