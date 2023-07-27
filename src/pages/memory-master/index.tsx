import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import Board from "@components/cards/Board";

const images = [
  "/assets/images/1.png",
  "/assets/images/2.png",
  "/assets/images/3.png",
  "/assets/images/4.png",
  "/assets/images/5.png",
  "/assets/images/6.png",
  //   "/assets/images/7.png",
]; // Add more images as needed

const generateCards = () => {
  const cards = images.reduce((acc, image) => {
    acc.push({ image, flipped: false, matched: false });
    acc.push({ image, flipped: false, matched: false });
    return acc;
  }, []);
  return shuffleArray(cards);
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [flippedIndexes, setFlippedIndexes] = useState([]);

  useEffect(() => {
    let timeout;
    if (isGameStarted) {
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, flipped: true }))
      );

      timeout = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: false }))
        );
        setIsGameStarted(true);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isGameStarted]);

  useEffect(() => {
    if (!isGameStarted) {
      setFlippedIndexes([]);
    }
  }, [isGameStarted]);

  const handleCardClick = (index) => {
    if (
      !isGameStarted ||
      flippedIndexes.includes(index) ||
      cards[index].flipped
    )
      return;

    console.log(
      !isGameStarted,
      flippedIndexes.includes(index),
      cards[index].flipped
    );
    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);

    if (newFlippedIndexes.length === 2) {
      const firstCard = cards[newFlippedIndexes[0]];
      const secondCard = cards[newFlippedIndexes[1]];

      if (firstCard.image === secondCard.image) {
        setCards((prevCards) =>
          prevCards.map((card, i) =>
            newFlippedIndexes.includes(i)
              ? { ...card, flipped: true, matched: true }
              : card
          )
        );
      }

      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card, i) =>
            newFlippedIndexes.includes(i) ? { ...card, flipped: false } : card
          )
        );
        setFlippedIndexes([]);
      }, 1000);
    }
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameFinished(false);
    setFlippedIndexes([]);
    setCards(generateCards());
  };

  useEffect(() => {
    const isGameOver = cards.every((card) => card.matched);
    if (isGameOver) setIsGameFinished(true);
  }, [cards]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" gutterBottom>
        Memory Block Game
      </Typography>
      {isGameFinished ? (
        <Typography variant="h6" gutterBottom>
          Congratulations! You've completed the game.
        </Typography>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={handleStartGame}
            disabled={isGameStarted}
          >
            Start Game
          </Button>
          <Board
            cards={cards}
            onCardClick={handleCardClick}
            rows={4}
            cols={4}
          />
        </>
      )}
    </Box>
  );
};

export default MemoryGame;
