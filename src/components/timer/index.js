//react
import { useRef } from "react";
//mui
import { Typography, Box } from "@mui/material";
//css
import styles from "./index.module.css";
import { useEffect, useState } from "react";
function index({ maxCountDown, text, ...props }) {
  const [displayText, setDisplayText] = useState(text[0] || "");
  const [time, setTime] = useState(maxCountDown);
  const countIndex = useRef(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayText(text[countIndex.current]);
      setTime((prev) => (prev == -1 ? -1 : prev - 1));
      countIndex.current += 1;
    }, 1000);
    if (countIndex > maxCountDown) clearInterval(intervalId);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "40rem",
        minWidth: "25rem",
      }}
    >
      {time > -1 ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              width: "100%",
              height: "inherit",
            }}
          >
            <Typography variant="h6" className={`${styles.animateTypography}`}>
              {time === 0 ? "GO" : time}
            </Typography>
          </Box>
          <Typography
            align="center"
            sx={{
              fontSize: "2rem",
              fontWeight: "300",
              textTransform: "uppercase",
            }}
            className={styles?.displayText}
          >
            {displayText}
          </Typography>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
index.defaultProps = {
  text: ["Get Ready", "Relax your mind", "Keep Focused"],
  maxCountDown: 3,
};

export default index;
