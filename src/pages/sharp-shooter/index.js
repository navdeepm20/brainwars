//react
import { useState, useEffect, useRef } from "react";
//mui
import { Paper, Typography, Stack, Box } from "@mui/material";
//internal components
import Btn1 from "@/components/buttons/Btn1";
import ParticleBg from "@components/particlebg";
import ScoreCard from "./ScoreCard";
import Loader from "@/components/loader";
import Timer from "@/components/timer";
//context
// import { globalContext } from "@/context/GlobalContext";
//react
// import { useContext } from "react";
//appwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
  client,
  getUniqueId,
} from "@/utils/appwrite/appwriteConfig";
import { useRouter } from "next/router";
import { calculateScores } from "./utils";
//These are effective constants. You can direct tweak things from here.
const MIN = 1;
const MAX = 15;
const OPERATORS = ["+", "-"];
const OPTIONS_DEVIATION = 5;
const NEXT_QUESTION_DELAY = 1000; //in milliseconds
const MAX_LIFE_LINES = 3;
const MAX_SHOOTS = 5;

function index({ ...props }) {
  const router = useRouter();
  const { gsid: gameSessionId, gid: gameId, rId: roomId } = router.query;
  const [gameSessionInfo, setGameSessionInfo] = useState(null);
  const [showTimer, setShowTimer] = useState(true);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(null);
  const [pickedAnswer, setPickedAnswer] = useState("");
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [shootsLeft, setShootsLeft] = useState(MAX_SHOOTS);
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

  //adding realtime updates
  useEffect(() => {
    if (!isMounted.current) {
      generateQuestion();
      setShootsLeft((prev) => prev - 1);
    }

    client.subscribe(
      `databases.${dbIdMappings.main}.collections.${collectionsMapping?.game_session}.documents`,
      (response) => {
        console.log(response.payload);
        setGameSessionInfo(response.payload);
      }
    );

    return () => {
      isMounted.current = true;
    };
  }, []);
  //for showing the start timer
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimer(false);
    }, 4000);
    return () => {
      clearInterval(timeoutId);
    };
  }, []);
  //abort game if shoots lefts < 0 || lifeLines === 0 (Calculate scores as well)
  const isAlreadySubmittedRef = useRef(false);
  useEffect(() => {
    if (
      (lifeLines === 0 && !isAlreadySubmittedRef.current) ||
      (shootsLeft < 0 &&
        scores?.totalShoots === MAX_SHOOTS &&
        !isAlreadySubmittedRef.current)
    ) {
      alert("going to send scores.");
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
          setTimeout(() => {
            setLoading((prev) => ({
              ...prev,
              isLoading: false,
              msg: "Loading...",
            }));
            router.push({
              pathname: "/scores",
              query: {
                rid: roomId,
              },
            });
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [shootsLeft, lifeLines, scores]);
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
        console.log(err);
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
                    Let's Roll
                  </Typography>
                </>
              ) : (
                <></>
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
                      <Typography variant="p" sx={{ fontSize: "4rem" }}>
                        {question}
                      </Typography>
                      <Typography
                        variant="p"
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
                      All Life's Exhausted! 💔
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
                        disableMessage
                        life={lifeLines}
                      />
                    )}
                  </>
                )
              ) : (
                <>
                  <Typography mt={1} mb={2} align="center">
                    Congratulation's 🎉
                  </Typography>
                  <Typography sx={{ fontSize: "3rem", mb: "3rem" }}>
                    GAME COMPLETED
                  </Typography>
                  {loading?.isLoading ? (
                    <Loader disableMessage />
                  ) : (
                    <ScoreCard completed scores={scores} life={lifeLines} />
                  )}
                </>
              )}
            </>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default index;
