import React, { useState, useEffect, useRef } from "react";
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
import { customToast, getModeId } from "@/utils/utils";
import { gameModeId } from "@/utils/constants";

//next
import { useRouter } from "next/router";

//appwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
} from "@/utils/appwrite/appwriteConfig";
//node
import { ParsedUrlQuery } from "querystring";
import GameCompleted from "@/components/cards/GameCompleted";

//TOTAL PAIRS
const TOTAL_CARD_PAIRS = 6;
const images = [
  "/assets/images/1.webp",
  "/assets/images/2.webp",
  "/assets/images/3.webp",
  "/assets/images/4.webp",
  "/assets/images/5.webp",
  "/assets/images/6.webp",
  "/assets/images/7.webp",
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
  const gameTimerRef = useRef<number>(null);

  const [modeId, setModeId] = useState(null);
  const [cards, setCards] = useState(generateCards());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [showTimer, setShowTimer] = useState(true);
  const [startTimer, setStartTimer] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);
  const [totalRightPairs, setTotalRightPairs] = useState(0);
  //for child component state

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
        setModeId(getModeId());
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

  //send realtime game updates
  useEffect(() => {
    sendDataRealtime();
  }, [totalRightPairs]);

  //check for game over
  useEffect(() => {
    const isGameOver = cards.every((card) => card.matched);
    if (isGameOver) {
      setIsGameFinished(true);
    }
  }, [cards]);

  //for removing the start timer after 4 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimer(false);
    }, 5000);
    const countdownAudio = new Audio("/assets/audios/countdown/countdown.mp3");
    countdownAudio.play();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //function to send data in realtime to server
  function sendDataRealtime() {
    const promise = databases.updateDocument(
      dbIdMappings.main,
      collectionsMapping.game_session,
      gameSessionId,
      {
        extras: JSON.stringify({
          movesDone: totalMoves,
          timeElapsed: gameTimerRef?.current,
          totalPairs: TOTAL_CARD_PAIRS,
          rightPairFlipped: totalRightPairs,
        }),
      }
    );
    promise
      .then((response) => {})
      .catch((err) => {
        customToast(err?.message, "error");
      });
  }
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
          background: "rgba(255, 255, 255, 0.02)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur( 4px )",
          border: "1px solid rgba(255, 255, 255, 0.2)",
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
              <GameCompleted
                onTimerCompleted={() => {
                  if (modeId && isGameFinished) {
                    if (modeId === gameModeId?.multi) {
                      router.push({
                        pathname: "/scores",
                        query: {
                          rid: roomId,
                          gsid: gameSessionId,
                        },
                      });
                    } else {
                      router.push({
                        pathname: "/scores",
                        query: {
                          gsid: gameSessionId,
                        },
                      });
                    }
                  }
                }}
                showTimer={true}
                maxRedirectTime={5}
              />
            ) : (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%", mt: 4 }}
                >
                  <TimeElapsedTimer
                    startTimer={startTimer}
                    timerRef={gameTimerRef}
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
