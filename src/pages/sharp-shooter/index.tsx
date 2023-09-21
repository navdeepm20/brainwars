//react
import { useState, useEffect, useRef } from "react";
//mui
import { Paper, Typography, Stack, Box } from "@mui/material";
//internal components
import Btn1 from "@/components/buttons/Btn1";
import ParticleBg from "@components/particlebg";
import ScoreCard from "@components/cards/ScoresCard";
import Loader from "@/components/loader";
import Timer from "@/components/countdown_timer";
import GameSoundPlayer from "@components/game_sound_player";
import GameCompleted from "@/components/cards/GameCompleted";
//appwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
  getUniqueId,
} from "@/utils/appwrite/appwriteConfig";
//next
import { useRouter } from "next/router";
//utils
import { calculateScores } from "@/utils/components/sharpShooter.js";
import { customToast, getModeId } from "@/utils/utils";
import { gameModeId } from "@/utils/constants";
//node
import { ParsedUrlQuery } from "querystring";

//These are effective constants. You can direct tweak things from here.
const MIN: number = 1;
const MAX: number = 15;
const OPERATORS: string[] = ["+", "-"];
const OPTIONS_DEVIATION: number = 5;
const NEXT_QUESTION_DELAY: number = 1000; //in milliseconds
const MAX_LIFE_LINES: number = 3;
const MAX_SHOOTS: number = 10;

interface routerType extends ParsedUrlQuery {
  gsid: string | null | undefined;
  gid: string | null | undefined;
  rId: string | null | undefined;
}

function SharpShooter({ ...props }) {
  const router = useRouter();
  const {
    gsid: gameSessionId,
    gid: gameId,
    rId: roomId,
  } = router.query as routerType;
  const [modeId, setModeId] = useState<String | null>(null);
  // const [gameSessionInfo, setGameSessionInfo] = useState(null);
  const [showTimer, setShowTimer] = useState(true);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(null);
  const [pickedAnswer, setPickedAnswer] = useState("");
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [shootsLeft, setShootsLeft] = useState(MAX_SHOOTS);
  const [intervalId, setIntervalId] = useState(null);
  const [scoresRedirectTimer, setScoresRedirectTimer] = useState(5);
  const isAlreadySubmittedRef = useRef(false);
  const [gameTimer, setGameTimer] = useState(1);
  const [scores, setScores] = useState({
    right: 0,
    wrong: 0,
    finalScore: 0,
    totalShoots: 0,
  });
  const [loading, setLoading] = useState({
    isSubmitting: false,
    isLoading: false,
    msg: "",
  });

  //ctx
  // const { currentGame } = useContext(globalContext);

  const [lifeLines, setLifeLines] = useState(MAX_LIFE_LINES);
  const isMounted = useRef(false);

  //for playing countdown audio
  useEffect(() => {
    const countdownAudio = new Audio("/assets/audios/countdown/countdown.mp3");
    countdownAudio.play();
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      generateQuestion();
      setShootsLeft((prev) => prev - 1);
    }
    setModeId(getModeId());

    return () => {
      isMounted.current = true;
    };
  }, []);
  //update game session status to inprogress
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

  //for removing the start timer after 4 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimer(false);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let globalGameTimerId;
    if (showTimer === false) {
      globalGameTimerId = setInterval(() => {
        setGameTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(globalGameTimerId);
    };
  }, [showTimer]);
  const hours = Math.floor(gameTimer / 3600);
  const minutes = Math.floor((gameTimer % 3600) / 60);
  const seconds = gameTimer % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // const minutes = Math.floor(gameTimer / 60);
  // const seconds = gameTimer % 60;
  //abort game if shoots lefts < 0 || lifeLines === 0 (Calculate scores as well)

  useEffect(() => {
    if (
      (lifeLines === 0 && !isAlreadySubmittedRef.current) ||
      (shootsLeft < 0 &&
        scores?.totalShoots === MAX_SHOOTS &&
        !isAlreadySubmittedRef.current)
    ) {
      isAlreadySubmittedRef.current = true;

      setLoading((prev) => ({
        ...prev,
        isLoading: true,
        msg: "Calculating Scores",
      }));
      const finalScore = calculateScores(
        scores?.right,
        scores?.wrong,
        MAX_SHOOTS
      );
      setScores((prev) => ({
        ...prev,
        finalScore,
      }));

      //create scores
      databases
        ?.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.scores,
          getUniqueId(),
          {
            gameId,
            gameSessionId,
            score: finalScore,
            extra: JSON.stringify({
              rightAnswers: scores?.right,
              wrongAnswers: scores?.wrong,
              totalShoots: scores?.totalShoots,
              lifeLines,
            }),
          }
        )
        .then((response) => {
          setIntervalId(
            setInterval(() => {
              setScoresRedirectTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000)
          );
          setTimeout(() => {
            setLoading((prev) => ({
              ...prev,
              isLoading: false,
              msg: "Loading...",
            }));
          }, 5000);
        })
        .catch((err) => {
          customToast(err?.message, "error");
        });
    }
  }, [shootsLeft, lifeLines, scores]);

  useEffect(() => {
    if (intervalId && scoresRedirectTimer === 0) {
      clearInterval(intervalId);

      const promise = databases.updateDocument(
        dbIdMappings.main,
        collectionsMapping.game_session,
        gameSessionId,
        {
          timeElapsed: gameTimer,
        }
      );
      promise
        .then((response) => {
          if (modeId) {
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
          } else {
            customToast("Oops.. Mode not Found. Please restart the game");
          }
        })
        .catch((err) => {
          customToast(err?.message, "error");
        });
    }
  }, [intervalId, scoresRedirectTimer]);

  //send data in realtime to server
  function sendDataRealtime({ wrong, right, deductLife, ...props }) {
    setLoading((prev) => {
      return { ...prev, isSubmitting: true };
    });
    const promise = databases.updateDocument(
      dbIdMappings.main,
      collectionsMapping.game_session,
      gameSessionId,
      {
        extras: JSON.stringify({
          rightShoots: scores?.right + right,
          wrongShoots: scores?.wrong + wrong,
          totalShoots: MAX_SHOOTS,
          totalLifes: MAX_LIFE_LINES,
          lifesLeft: deductLife
            ? lifeLines > 0
              ? lifeLines - deductLife
              : 0
            : lifeLines,
          nextDelay: NEXT_QUESTION_DELAY,
          timeElapsed: gameTimer,
        }),
      }
    );
    promise
      .then((response) => {
        setLoading((prev) => {
          return { ...prev, isSubmitting: false };
        });
      })
      .catch((err) => {
        customToast(err?.message, "error");
      });
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const pickRandomOperator = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  };

  const generateQuestion = () => {
    const num1 = getRandomInt(MIN, MAX);
    const num2 = getRandomInt(MIN, MAX);
    const operator = pickRandomOperator(OPERATORS);
    setQuestion(`${num1} ${operator} ${num2} =`);
    const randomAnswerIndex = getRandomInt(0, 3);
    const evaluatedAnswer = evaluateAnswer(num1, num2, operator);
    const options = getOptions(evaluatedAnswer, randomAnswerIndex);
    setOptions(options);
    setOriginalAnswer(evaluatedAnswer);
  };

  const evaluateAnswer = (num1, num2, operator) => {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num1 / num2;
      default:
        return 0;
    }
  };

  const getOptions = (answer, answerIndex) => {
    const options = [];
    for (let i = 0; i < 4; i++) {
      if (i === answerIndex) {
        options.push(answer);
      } else {
        let option;
        do {
          option = getRandomInt(
            answer - OPTIONS_DEVIATION,
            answer + OPTIONS_DEVIATION
          );
        } while (answer === option || options.includes(option));
        options.push(option);
      }
    }
    return options;
  };

  //handlers
  const checkAnswer = (e, option) => {
    setIsCheckingAnswer(true);
    setPickedAnswer(option);
    if (option === originalAnswer) {
      setIsCorrect(true);
      setScores((prev) => {
        return {
          ...prev,
          right: prev?.right + 1,
          totalShoots: prev?.totalShoots + 1,
        };
      });
      sendDataRealtime({ right: true, wrong: false, deductLife: false });
    } else {
      setIsCorrect(false);
      setLifeLines((prev) => (prev !== 0 ? prev - 1 : 0));
      setScores((prev) => {
        return {
          ...prev,
          wrong: prev?.wrong + 1,
          totalShoots: prev?.totalShoots + 1,
        };
      });
      sendDataRealtime({ right: false, wrong: true, deductLife: true });
    }

    if (shootsLeft > 0) {
      setTimeout(() => {
        //resetting states
        setIsCheckingAnswer(false);
        setPickedAnswer("");
        setIsCorrect(false);
        setShootsLeft((prev) => prev - 1);
        generateQuestion();
      }, NEXT_QUESTION_DELAY);
    } else {
      setIsCheckingAnswer(false);
      setPickedAnswer("");
      setIsCorrect(false);
      setShootsLeft((prev) => prev - 1);
    }
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
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {showTimer ? (
          <Timer />
        ) : (
          <>
            <GameSoundPlayer musicPath="/assets/audios/game/music.mp3" />
            {shootsLeft >= 0 && lifeLines > 0 ? (
              <Typography variant="button" sx={{ color: "success.main" }}>
                Life: {lifeLines}❤️
              </Typography>
            ) : (
              <></>
            )}

            <>
              {shootsLeft >= 0 && lifeLines > 0 ? (
                <>
                  <Typography
                    variant="h5"
                    mt={6}
                    sx={{ color: "customTheme.text" }}
                    align="center"
                  >
                    Answer the below questions quickly
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "customTheme.text2" }}
                    align="center"
                  >
                    Let&apos;s Go
                  </Typography>
                </>
              ) : (
                <></>
              )}
              {shootsLeft > -1 && lifeLines > 0 && (
                <Typography
                  component="p"
                  mt={2}
                  sx={{ color: "customTheme.text2" }}
                >
                  Time Elapsed: {formattedTime}
                </Typography>
              )}

              {shootsLeft >= 0 ? (
                lifeLines > 0 ? (
                  <Stack
                    className="question-answer"
                    sx={{ mt: 5 }}
                    alignItems="center"
                    mb={1}
                  >
                    <Stack
                      direction="row"
                      p={2}
                      minHeight="10rem"
                      alignItems="center"
                    >
                      <Typography component="p" sx={{ fontSize: "4rem" }}>
                        {question}
                      </Typography>
                      <Typography
                        component="p"
                        sx={{
                          fontSize: "4rem",
                          border: (theme) =>
                            isCheckingAnswer
                              ? isCorrect
                                ? `1px solid ${theme.palette.success.main}`
                                : `1px solid ${theme.palette.error.main} `
                              : `1px solid ${theme.palette.customTheme.customGrey}`,
                          minWidth: "8rem",
                          minHeight: "5rem",
                          px: "1rem",
                          ml: "1.5rem",
                          cursor: "not-allowed",
                        }}
                        align="center"
                      >
                        {pickedAnswer}
                      </Typography>
                    </Stack>
                    <Box>
                      <Typography
                        sx={{ color: "customTheme.text2" }}
                        align="center"
                      >
                        Select the right one
                      </Typography>
                      <Stack
                        direction="row"
                        gap={2}
                        mt={3}
                        flexWrap="wrap"
                        justifyContent="center"
                      >
                        {options?.map((option, index) => (
                          <Btn1
                            variant="outlined"
                            disabled={isCheckingAnswer}
                            key={index}
                            onClick={(e) => checkAnswer(e, option)}
                          >
                            {option}
                          </Btn1>
                        ))}
                      </Stack>
                    </Box>
                    <Typography
                      sx={{ mt: 8, color: "customTheme.text2" }}
                      variant="button"
                      textAlign="center"
                    >
                      Shoots Left: {shootsLeft}
                    </Typography>
                  </Stack>
                ) : (
                  <>
                    <Typography mt={1} mb={2} align="center">
                      All Life&apos;s Exhausted! 💔
                    </Typography>
                    <Typography
                      sx={{ fontSize: "3rem", mb: "3rem" }}
                      align="center"
                    >
                      GAME OVER
                    </Typography>
                    {loading?.isSubmitting ? (
                      <Loader message={loading?.msg} />
                    ) : (
                      <ScoreCard
                        scores={scores}
                        disableMessage={true}
                        life={lifeLines}
                        timer={scoresRedirectTimer}
                      />
                    )}
                  </>
                )
              ) : (
                <GameCompleted
                  addtionalComponent={
                    <div>
                      {loading?.isLoading ? (
                        <Loader disableMessage={true} />
                      ) : (
                        <ScoreCard
                          completed
                          scores={scores}
                          life={lifeLines}
                          timer={scoresRedirectTimer}
                        />
                      )}
                    </div>
                  }
                />
              )}
            </>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default SharpShooter;
