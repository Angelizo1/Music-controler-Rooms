import React, { useState } from "react";
import { useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  Card,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  IconButton,
  duration,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Box from "@mui/material/Box";

export const MusicPlayer = ({
  image_url,
  title,
  artist,
  is_playing,
  time,
  duration,
}) => {
  const [image, setImage] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [isPlaying, setIsPlaying] = useState("");

  useEffect(() => {
    setImage(image_url);
    setSongTitle(title);
    setSongArtist(artist);
    setIsPlaying(is_playing);
  }, [image_url, title, artist, is_playing]);

  const songProgress = (time / duration) * 100;

  const handlePauseSong = () => {
    const request = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    fetch("http://127.0.0.1:8000/spotify/pause-song", request).then((data) => {
      if (data.status === 204) setIsPlaying(false);
    });
  };

  const handlePlaySong = () => {
    const request = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    fetch("http://127.0.0.1:8000/spotify/play-song", request).then((data) => {
      if (data.status === 204) setIsPlaying(true);
    });
  };

  return (
    <Card>
      <Grid>
        <Grid>
          <img src={image} height="100%" width="100%" />
        </Grid>
        <Grid>
          <Typography variant="h5">{songTitle}</Typography>
          <Typography color="textSecondary" variant="subtitle">
            {songArtist}
          </Typography>
          <Box>
            <IconButton>
              {isPlaying ? (
                <PauseIcon onClick={handlePauseSong} />
              ) : (
                <PlayArrowIcon onClick={handlePlaySong} />
              )}
            </IconButton>
            <IconButton>
              <SkipNextIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};
