import React from "react";
import { Box } from "@mui/material";
//next
import Image from "next/image";
import CardBackImg from "@public/assets/images/card-back.jpg";

const Card = ({ cardId, image, flipped, disable, onClick, cardIndex }) => {
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
        <Image
          src={flipped ? image : CardBackImg}
          alt="card image"
          fill={true}
          quality={1}
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
};

export default Card;
