import React, { useState } from "react";
import { useParams } from "react-router-dom";

export const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const { roomCode } = useParams();

  return (
    <>
      <h3>{roomCode}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>Guest can Pause: {guestCanPause}</p>
      <p>Host: {isHost}</p>
    </>
  );
};
