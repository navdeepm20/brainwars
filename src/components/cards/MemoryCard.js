import React from "react";
import { Box } from "@mui/material";
//next
import Image from "next/image";
import CardBackImg from "@public/assets/images/card-back.webp";

const Card = ({ cardId, image, flipped, disable, onClick, cardIndex }) => {
  console.log(image, CardBackImg);
  return (
    <Box
      onClick={(e) => {
        flipped ? () => {} : onClick(cardId, image, cardIndex);
      }}
    >
      <Box
        sx={(theme) => ({
          cursor: flipped ? "not-allowed" : "pointer",
          transform: flipped ? "rotateY(180deg)" : "",
          transition: ".7s transform ease",
          width: "100px",
          height: "160px",
          mx: "auto",
          border: `1px solid ${theme.palette.customTheme.customGrey}`,
          display: "grid",
          placeItems: "center",
          borderRadius: "4px",
          position: "relative",
        })}
      >
        <img
          src={flipped ? image : CardBackImg?.src}
          alt="card image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
};

export default Card;
