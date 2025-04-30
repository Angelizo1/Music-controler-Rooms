import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

import CreateRoomPage from "./CreateRoomPage";

export const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { roomCode } = useParams();
  const navigate = useNavigate();

  const getRoomDetails = async (code) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/get-room?code=${code}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) return navigate("/");
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  const handleLeaveRoom = async () => {
    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    try {
      await fetch("http://127.0.0.1:8000/api/leave-room/", request).then(
        (res) => {
          navigate("/");
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSettings = (value) => {
    setShowSettings(value);
  };

  const displaySettings = () => {
    return (
      <Grid container spacing={1} direction="column">
        <Grid item columns={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateSettings(false)} //review
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const displaySettingsButton = () => {
    return (
      <Grid columns={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdateSettings(true)} //review
        >
          Settings
        </Button>
      </Grid>
    );
  };

  useEffect(() => {
    if (roomCode) getRoomDetails(roomCode);
  }, [roomCode]);
  return (
    <>
      {showSettings ? (
        displaySettings()
      ) : (
        <Grid container spacing={1} direction="column">
          <Grid columns={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {roomCode}
            </Typography>
          </Grid>
          <Grid columns={12} align="center">
            <Typography variant="h6" component="h6">
              Votes: {votesToSkip}
            </Typography>
          </Grid>
          <Grid columns={12} align="center">
            <Typography variant="h6" component="h6">
              Guest can Pause: {guestCanPause.toString()}
            </Typography>
          </Grid>
          <Grid columns={12} align="center">
            <Typography variant="h6" component="h6">
              Host: {isHost.toString()}
            </Typography>
          </Grid>
          {isHost ? displaySettingsButton() : <h1>You suck</h1>}
          <Grid columns={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={handleLeaveRoom}
            >
              Leave Room
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};
