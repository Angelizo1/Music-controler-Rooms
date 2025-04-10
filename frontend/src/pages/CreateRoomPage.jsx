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
import { Link } from "react-router-dom";
import React, { useState } from "react";

const CreateRoomPage = () => {
  const [defaultVotes, setDefaultVotes] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(2);

  const handleGuestCanPause = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleVotesChange = (e) => {
    setVotesToSkip(Number(e.target.value));
  };

  const handleCreateRoom = () => {
    console.log("Creating a room with:");
    console.log("Guest can pause:", guestCanPause);
    console.log("Votes to Skip:", votesToSkip);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("http://127.0.0.1:8000/api/create-room/", requestOptions)
      .then((res) => res.json())
      .then((data) => console.log("here is data", data));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest control of Playback State</div>
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
      <Grid item xs={12} align="center">
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
          <FormHelperText>
            <div align="center">Votes required to skip</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={handleCreateRoom}
        >
          Create a Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateRoomPage;
