import React from "react";
import { Card as MuiCard, CardMedia } from "@mui/material";
// import CardBack from "@public/assests/images/card-back.jpg";
const Card = ({ image, flipped, onClick }) => {
  return (
    <MuiCard
      onClick={() => {
        onClick();
      }}
      sx={{ cursor: "pointer" }}
    >
      <CardMedia
        component="img"
        height="150"
        image={flipped ? image : "/assets/images/card-back.jpg"}
        alt={flipped ? "Card Front" : "Card Back"}
      />
    </MuiCard>
  );
};

export default Card;
