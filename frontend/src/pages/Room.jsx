import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
} from "@mui/material";

import { MusicPlayer } from "./MusicPlayer";

import CreateRoomPage from "./CreateRoomPage";

export const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

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

  useEffect(() => {
    if (isHost) {
      console.log("value of host", isHost);
      authenticateSpotify();
    }
  }, [isHost]);

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

  const getCurrentSong = () => {
    fetch("http://127.0.0.1:8000/spotify/current-song", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return {};
        }
        return response.json(); //very important to get his with the return
      })
      .then((data) => {
        // console.log(data);
        setSong(data);
      })
      .catch((err) => console.log(err));
  };

  const authenticateSpotify = () => {
    console.log("Auth happening");
    fetch("http://127.0.0.1:8000/spotify/is_authenticated", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("is authenticated", data);
        setIsSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch(
            "http://127.0.0.1:8000/spotify/get-auth-url?roomCode=" + roomCode,
            {
              credentials: "include",
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log("Final one", data);
              // getCurrentSong();
              window.location.replace(data.url);
            });
        }
        getCurrentSong();
      })
      .catch((err) => console.error("Error getting auth URL:", err));
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

  const spotifyPolling = () => {
    return setInterval(getCurrentSong, 120000); //returns id of interval for being stopped
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getCurrentSong();
    }, 20000);

    return () => {
      clearInterval(intervalId);   //clear when unmounting component
    };
  }, []);

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
          <MusicPlayer { ...song }/>
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
