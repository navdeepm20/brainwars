//react
import { useState, useEffect } from "react";
//mui
import { Paper, Typography, Stack, Container, Box } from "@mui/material";
//internal components
import Btn1 from "@/components/buttons/Btn1";

import ParticleBg from "@components/particlebg";

//These are effective constants. You can direct tweak things from here.
const MIN = 1;
const MAX = 10;
const OPERATORS = ["+", "-"];
const OPTIONS_DEVIATION = 5;
const NEXT_QUESTION_DELAY = 300; //in milliseconds
const MAX_LIFE_LINES = 3;

function index({ ...props }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(null);
  const [pickedAnswer, setPickedAnswer] = useState("");
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [answer, setAnswer] = useState("0");
  const [isCorrect, setIsCorrect] = useState(false);
  const [lifeLines, setLifeLines] = useState(MAX_LIFE_LINES);

  useEffect(() => {
    generateQuestion();
  }, []);

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
    const answer = evaluateAnswer(num1, num2, operator);
    const options = getOptions(answer, randomAnswerIndex);
    setOptions(options);
    setAnswer(answer);
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
    if (option === answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setLifeLines((prev) => (prev !== 0 ? prev - 1 : 0));
    }
    setTimeout(() => {
      //resetting states
      setIsCheckingAnswer(false);
      setPickedAnswer("");
      setIsCorrect(false);
      generateQuestion();
    }, NEXT_QUESTION_DELAY);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <ParticleBg />

      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "1rem 2rem",
          background: " rgba( 77, 72, 72, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          backdropFilter: "blur( 4px )",
          borderRadius: "10px",
          border: "1px solid rgba( 255, 255, 255, 0.18 )",
        }}
      >
        <Typography variant="button" sx={{ color: "success.main" }}>
          Life: {lifeLines}❤️
        </Typography>
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
          sx={{ color: "customTheme.text2", mb: 4 }}
          align="center"
        >
          Let's Roll
        </Typography>

        {lifeLines ? (
          <Stack
            className="question-answer"
            sx={{ mt: 5 }}
            alignItems="center"
            pb={2}
            mb={10}
          >
            <Stack direction="row" p={2} minHeight="10rem" alignItems="center">
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
              <Typography sx={{ color: "customTheme.text2" }} align="center">
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
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "3rem", mb: "3rem" }}>
            GAME OVER
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default index;
