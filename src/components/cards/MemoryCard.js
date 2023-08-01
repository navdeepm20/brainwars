import React from "react";
import { Card as MuiCard, CardMedia } from "@mui/material";
// import CardBack from "@public/assests/images/card-back.jpg";
const Card = ({ image, flipped, disable, onClick, index }) => {
  return (
    <MuiCard
      onClick={() => {
        onClick();
      }}
      sx={{
        cursor: disable ? "not-allowed" : "pointer",
        pointerEvents: disable ? "none" : "all",
        width: "100px",
        mx: "auto",
      }}
    >
      <CardMedia
        component="img"
        image={flipped ? image : "/assets/images/card-back.jpg"}
        alt={flipped ? "Card Front" : "Card Back"}
        sx={{ maxWidth: "100%" }}
      />
    </MuiCard>
  );
};

export default Card;
