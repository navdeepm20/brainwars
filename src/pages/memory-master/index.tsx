import React, { useState, useEffect } from "react";
import { Stack, Typography, Box, Paper } from "@mui/material";
//internal
import ParticleBg from "@components/particlebg";
import Board from "@components/cards/Board";
import CountDownTimer from "@/components/countdown_timer";
import TimeElapsedTimer from "@/components/time_elapsed";
import CustomButton from "@components/buttons/LoadingBtn";
import GameSoundPlayer from "@components/game_sound_player";
//utils
import { playSound } from "@/utils/utils";
import { calculateScores } from "@/utils/components/sharpShooter.js";
import { customToast, getModeId } from "@/utils/utils";
import { gameModeId } from "@/utils/constants";
//next
import { useRouter } from "next/router";
//appwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
  getUniqueId,
} from "@/utils/appwrite/appwriteConfig";
//node
import { ParsedUrlQuery } from "querystring";

//TOTAL PAIRS
const TOTAL_CARD_PAIRS = 6;
const images = [
  "/assets/images/1.jpg",
  "/assets/images/2.jpg",
  "/assets/images/3.jpg",
  "/assets/images/4.jpg",
  "/assets/images/5.jpg",
  "/assets/images/6.jpg",
  "/assets/images/7.png",
]; // Add more images as needed

const generateCards = () => {
  const cards = images
    .slice(0, TOTAL_CARD_PAIRS)
    .reduce((acc, image) => {
      acc.push({ image, flipped: false, matched: false });
      acc.push({ image, flipped: false, matched: false });
      return acc;
    }, [])
    .map((card, index) => ({ ...card, id: `card-id-${index}` }));

  return shuffleArray(cards);
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

interface routerType extends ParsedUrlQuery {
  gsid: string | null | undefined;
  gid: string | null | undefined;
  rId: string | null | undefined;
}

const MemoryGame = () => {
  const router = useRouter();
  const {
    gsid: gameSessionId,
    gid: gameId,
    rId: roomId,
  } = router.query as routerType;

  const [cards, setCards] = useState(generateCards());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [showTimer, setShowTimer] = useState(true);
  const [startTimer, setStartTimer] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);
  const [totalRightPairs, setTotalRightPairs] = useState(0);
  //for child component state
  const [currentElapsedTime, setCurrentElapsedTime] = useState(0);
  //show cards when game started
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
        setStartTimer(true);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isGameStarted]);

  //update game status to inprogress
  useEffect(() => {
    if (gameSessionId)
      (async () => {
        try {
          await databases.updateDocument(
            dbIdMappings?.main,
            collectionsMapping?.game_session,
            gameSessionId,
            {
              status: "InProgress",
            }
          );
        } catch (err) {
          customToast(err.message, "error");
        }
      })();
  }, [gameSessionId]);
  //function to get the child component state for time elapsed
  const getTimeElapsed = (timeElapsed: number): void =>
    setCurrentElapsedTime(timeElapsed);

  //function to send data in realtime to server
  function sendDataRealtime() {
    const promise = databases.updateDocument(
      dbIdMappings.main,
      collectionsMapping.game_session,
      gameSessionId,
      {
        extras: JSON.stringify({
          movesDone: totalMoves,
          timeElapsed: currentElapsedTime,
          totalPairs: TOTAL_CARD_PAIRS,
          rightPairFlipped: totalRightPairs,
        }),
      }
    );
    promise
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        customToast(err?.message, "error");
      });
  }
  //send realtime game updates
  useEffect(() => {
    sendDataRealtime();
  }, [totalMoves]);

  //handle card flip
  const handleCardFlip = (clickedCardId, cardImage, cardIndex) => {
    const newFlippedIndexes = [...flippedIndexes, cardIndex];
    setFlippedIndexes((prev) => {
      return Array.from(new Set([...prev, cardIndex]));
    });
    setCards(
      cards.map((card) => {
        return card.id === clickedCardId ? { ...card, flipped: true } : card;
      })
    );
    return newFlippedIndexes;
  };
  //handle card match
  const handleCardMatch = (cardId, cardImage, cardIndex) => {
    // ....
    let newFlippedIndexes = [];
    //flip the card
    if (flippedIndexes.length < 2)
      newFlippedIndexes = handleCardFlip(cardId, cardImage, cardIndex);
    else {
      //show notification about two card can be flipped at a time
      return;
    }

    setTimeout(() => {
      if (newFlippedIndexes?.length === 2) {
        //check card images are equal and they both are not same card
        if (
          cards[newFlippedIndexes[0]]?.image ===
            cards[newFlippedIndexes[1]]?.image &&
          cards[newFlippedIndexes[0]].id !== cards[newFlippedIndexes[1]]
        ) {
          //card matched. Reset flipped indexes to empty
          setFlippedIndexes([]);
          setTotalRightPairs((prev) => prev + 1);
          //enable matched property of card so that they remains flipped
          setCards((prev) =>
            prev.map((card, index) => {
              if (
                card.id === cards[newFlippedIndexes[0]].id ||
                card.id === cards[newFlippedIndexes[1]]?.id
              ) {
                return { ...card, disable: true, matched: true };
              }
              return card;
            })
          );
        } else {
          //else flip back the card
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card, index) => {
                if (newFlippedIndexes.includes(index)) {
                  return { ...card, flipped: false };
                }
                return card;
              })
            );
            //reset flipped index array
            setFlippedIndexes([]);
          }, 1000);
        }
      }
    }, 1000);
  };

  //handle card click
  const handleCardClick = (cardId, cardImage, cardIndex) => {
    if (isGameStarted) {
      playSound();
      setTotalMoves((prev) => prev + 1);
      if (flippedIndexes.length < 1) {
        handleCardFlip(cardId, cardImage, cardIndex);
      } else {
        handleCardMatch(cardId, cardImage, cardIndex);
      }
    }
  };

  //handle start game
  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameFinished(false);
    setFlippedIndexes([]);
    setCards(generateCards());
  };
  //check for game over
  useEffect(() => {
    const isGameOver = cards.every((card) => card.matched);
    if (isGameOver) {
      setIsGameFinished(true);
      alert("Game finished");
    }
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
          <CountDownTimer />
        ) : (
          <>
            <GameSoundPlayer
              musicPath="/assets/audios/game/music.mp3"
              sx={{ mb: 0 }}
            />
            <Typography variant="h5" gutterBottom>
              Memory Master
            </Typography>
            {isGameFinished ? (
              <Typography variant="h6" gutterBottom>
                Congratulations! You've completed the game.
              </Typography>
            ) : (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%", mt: 4 }}
                >
                  <TimeElapsedTimer
                    startTimer={startTimer}
                    getElapsedTime={getTimeElapsed}
                    sx={{
                      color: "customTheme.text2",
                      "& span": {
                        color: "customTheme.text",
                      },
                    }}
                  />
                  <Typography sx={{ color: "customTheme.text2" }}>
                    No. Of Moves:{" "}
                    <Typography
                      component="span"
                      sx={{
                        color: "customTheme.text",
                      }}
                    >
                      {totalMoves}
                    </Typography>
                  </Typography>
                </Stack>
                <Board cards={cards} onCardClick={handleCardClick} />
                {!isGameStarted && (
                  <CustomButton
                    variant="outlined"
                    onClick={handleStartGame}
                    disabled={isGameStarted}
                    sx={{ mt: 4 }}
                  >
                    Start Game
                  </CustomButton>
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MemoryGame;
