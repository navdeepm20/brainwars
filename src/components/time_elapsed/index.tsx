//react
import { useState } from "react";
//mui
import { Typography } from "@mui/material";
import { useEffect } from "react";

interface Props {
  title?: string;
  startTimer: boolean;
  [props: string]: any;
}
function index({ title, startTimer, sx, ...props }: Props) {
  const [gameTimer, setGameTimer] = useState<number>(0);

  useEffect(() => {
    if (startTimer) {
      let intervalId = setInterval(() => {
        setGameTimer((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [startTimer]);

  const hours = Math.floor(gameTimer / 3600);
  const minutes = Math.floor((gameTimer % 3600) / 60);
  const seconds = gameTimer % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return (
    <Typography component="p" sx={{ color: "customTheme.text2", ...sx }}>
      Time Elapsed: <Typography component="span">{formattedTime}</Typography>
    </Typography>
  );
}

export default index;
