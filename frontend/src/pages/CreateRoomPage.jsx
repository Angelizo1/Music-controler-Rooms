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
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import { useEffect } from "react";
import { Alert } from "@mui/material";

const CreateRoomPage = (props) => {
  const {
    update,
    roomCode,
    votesToSkip: votesUpdate,
    guestCanPause: pauseUpdate,
    updateCallback,
  } = props;

  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [updateMsg, setUpdateMsg] = useState("");

  const title = update ? "Update Room" : " Create a Room ";
  const navigate = useNavigate();

  const handleGuestCanPause = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleVotesChange = (e) => {
    setVotesToSkip(Number(e.target.value));
  };

  const handleCreateRoom = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
      credentials: "include",
    };

    fetch("http://127.0.0.1:8000/api/create-room/", requestOptions)
      .then((res) => res.json())
      .then((data) => navigate(`/room/${data.code}`));
  };

  const handleUpdateRoom = () => {
    console.log("payload update", votesToSkip, guestCanPause);
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
      credentials: "include",
    };

    fetch("http://127.0.0.1:8000/api/update-room/", requestOptions).then(
      (res) => {
        updateCallback(roomCode);
        if (res.ok) return setUpdateMsg("Room Updated Succesfully");
        setUpdateMsg("Error updating Room");
      }

      // res.json()
    );
  };

  const CreateRoomSection = () => {
    return (
      <Grid container spacing={1}>
        <Grid columns={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={handleCreateRoom}
          >
            Create a Room
          </Button>
        </Grid>
        <Grid columns={12} align="center">
          <Button color="primary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const UpdateSection = () => {
    return (
      <Grid columns={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={handleUpdateRoom}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  useEffect(() => {
    if (update) {
      setGuestCanPause(pauseUpdate);
      setVotesToSkip(votesUpdate);
    }
  }, [update, pauseUpdate, votesUpdate]);

  return (
    <Grid container spacing={1} direction="column">
      <Grid columns={12} align="center">
        <Collapse in={updateMsg != ""}>
          {updateMsg !== "" && (
            <Alert
              severity={/\bError\b/.test(updateMsg) ? "error" : "success"}  //love it
              onClose={() => {
                setUpdateMsg("");
              }}
            >
              {updateMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid columns={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid columns={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText sx={{ textAlign: "center" }}>
            Guest control of Playback State
          </FormHelperText>

          <RadioGroup
            row
            value={guestCanPause.toString()}
            onChange={handleGuestCanPause}
          >
            <FormControlLabel
              value="true"
              control={<Radio control="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio control="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid columns={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            value={votesToSkip}
            onChange={handleVotesChange}
            slotProps={{
              input: {
                min: 1,
                style: {
                  color: "blue",
                  backgroundColor: "#eef",
                  textAlign: "center",
                },
              },
            }}
            sx={{
              input: {
                textAlign: "center",
              },
            }}
          />
          <FormHelperText sx={{ textAlign: "center" }}>
            Votes required to skip
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? <UpdateSection /> : <CreateRoomSection />}
    </Grid>
  );
};

export default CreateRoomPage;
