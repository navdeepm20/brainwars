//mui
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type PropTypes = {
  additionalComponent?: React.ReactNode;
  sx?: object;
  [props: string]: any;
  onTimerCompleted?: () => void;
  showTimer?: boolean;
  maxRedirectTime?: number;
};

function GameCompleted({
  addtionalComponent,
  sx,
  maxRedirectTime,
  showTimer,
  onTimerCompleted,
  ...props
}: PropTypes) {
  const [timer, setTimer] = useState(maxRedirectTime);

  useEffect(() => {
    if (timer >= 0) {
      const intervalId = setInterval(() => {
        if (timer === 0) {
          onTimerCompleted();
          return clearInterval(intervalId);
        }
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [timer]);

  return (
    <Box sx={{ ...sx }}>
      <Typography mt={1} mb={2} align="center">
        Congratulation's 🎉
      </Typography>
      <Typography sx={{ fontSize: "3rem", mb: "3rem" }}>
        GAME COMPLETED
      </Typography>
      <Typography
        align="center"
        sx={{ color: "customTheme.text2", mt: "5rem" }}
      >
        Redirecting in {timer}
      </Typography>
      {addtionalComponent}
    </Box>
  );
}

export default GameCompleted;
