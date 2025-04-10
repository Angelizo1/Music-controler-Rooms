// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import React from 'react';

const RoomJoinPage = () => {
  const navigate = useNavigate();
  // console.log("RoomJoinPage RoomJoinPage")
  return (
    <div>
      <h1>🏠RoomJoinPage Page</h1>
      <button onClick={() => navigate("/about")}>Go to About</button>
    </div>
  );
};

export default RoomJoinPage;
