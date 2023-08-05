import React from "react";
import { Grid } from "@mui/material";
import Card from "@components/cards/MemoryCard";

const Board = ({ cards, onCardClick }) => {
  return (
    <Grid container spacing={2} mt={2}>
      {cards.map((card, index) => (
        <Grid item xs={3} key={index}>
          <Card
            image={card.image}
            flipped={card.flipped}
            onClick={onCardClick}
            cardId={card.id}
            disable={card.disable}
            cardIndex={index}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Board;
