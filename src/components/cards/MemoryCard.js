import React from "react";
import { Card as MuiCard, CardMedia } from "@mui/material";
// import CardBack from "@public/assets/images/card-back.jpg";
const Card = ({ cardId, image, flipped, disable, onClick, cardIndex }) => {
  return (
    <MuiCard
      onClick={(e) => {
        flipped ? () => {} : onClick(cardId, image, cardIndex);
      }}
      sx={{
        cursor: flipped ? "not-allowed" : "pointer",
        transform: flipped ? "rotateY(180deg)" : "",
        transition: ".7s transform ease",
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
