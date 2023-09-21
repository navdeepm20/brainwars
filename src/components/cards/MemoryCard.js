import React from "react";
import { Box } from "@mui/material";
//next
import Image from "next/image";
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
        })}
      >
        {flipped ? (
          <Image
            src={image}
            alt="card image"
            style={{ maxWidth: "90%" }}
            priority={true}
          />
        ) : (
          <Image
            src="/assets/images/card-back.jpg"
            alt="Card Back"
            width={100}
            style={{
              transform: flipped ? "rotateY(180deg)" : "",
              transition: ".7s transform ease",
            }}
            priority={true}
          />
        )}
      </Box>
    </Box>
  );
};

export default Card;
