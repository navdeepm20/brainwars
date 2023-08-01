import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
//internal
import ParticleBg from "@components/particlebg";
import Board from "@components/cards/Board";
import Timer from "@components/timer";

const images = [
  "/assets/images/1.png",
  "/assets/images/2.png",
  "/assets/images/3.png",
  "/assets/images/4.png",
  "/assets/images/5.png",
  "/assets/images/6.png",
  // "/assets/images/7.png",
]; // Add more images as needed

const generateCards = () => {
  const cards = images
    .reduce((acc, image) => {
      acc.push({ image, flipped: false, matched: false });
      acc.push({ image, flipped: false, matched: false });
      return acc;
    }, [])
    .map((card, index) => ({ ...card, id: index }));

  return shuffleArray(cards);
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [showTimer, setShowTimer] = useState(true);
  const [gameTimer, setGameTimer] = useState(1);

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
    if (isGameStarted) {
      if (flippedIndexes.length < 2) {
        const newFlippedIndexes = [...flippedIndexes, index];
        setFlippedIndexes((prev) => {
          return Array.from(new Set(newFlippedIndexes));
        });

        setCards((prevCards) =>
          prevCards.map((card, i) => {
            if (i === index) {
              return { ...card, flipped: true };
            }
            return card;
          })
        );

        setTimeout(() => {
          if (newFlippedIndexes?.length === 2) {
            if (
              cards[newFlippedIndexes[0]]?.image ===
                cards[newFlippedIndexes[1]]?.image &&
              cards[newFlippedIndexes[0]] !== cards[newFlippedIndexes[1]]
            ) {
              setFlippedIndexes([]);
              setCards((prev) =>
                prev.map((card, index) => {
                  if (
                    card.id === newFlippedIndexes[0] ||
                    card.id === newFlippedIndexes[1]
                  ) {
                    return { ...card, disable: true };
                  }
                  return card;
                })
              );
            } else {
              setTimeout(() => {
                setCards((prev) =>
                  prev.map((card, index) => {
                    if (newFlippedIndexes.includes(index)) {
                      return { ...card, flipped: false };
                    }
                    return card;
                  })
                );
                setFlippedIndexes([]);
              }, 1000);
            }
          }
        }, 1000);
      }
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

  //for removing the start timer after 4 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimer(false);
    }, 4000);
    const countdownAudio = new Audio("/assets/audios/countdown/countdown.mp3");
    countdownAudio.play();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Box width="100%">
      <ParticleBg />
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "5rem 2rem",
          background: " rgba( 77, 72, 72, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          backdropFilter: "blur( 4px )",
          borderRadius: "10px",
          border: "1px solid rgba( 255, 255, 255, 0.18 )",
        }}
      >
        {showTimer ? (
          <Timer />
        ) : (
          <>
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
                <Board cards={cards} onCardClick={handleCardClick} />
              </>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MemoryGame;
