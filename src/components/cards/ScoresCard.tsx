//mui
import { Box, Typography, Stack } from "@mui/material";

interface scoreCardProps {
  completed?: boolean;
  scores: {
    right: number;
    wrong: number;
  };
  life: number;
  timer: number;
  [props: string]: any;
}
function ScoreCard({
  completed,
  scores,
  life,
  timer,
  ...props
}: scoreCardProps) {
  return (
    <>
      {completed ? (
        <Box mb={3}>
          <Stack direction="row" spacing={2}>
            <Typography sx={{ color: "success.main" }}>
              Right Answers:{" "}
              <Typography component="span" sx={{ color: "success.main" }}>
                {scores?.right}
              </Typography>{" "}
            </Typography>
            <Typography sx={{ color: "error.main" }}>
              Wrong Answers:{" "}
              <Typography component="span" sx={{ color: "error.main" }}>
                {scores?.wrong}
              </Typography>
            </Typography>
          </Stack>
          <Typography
            align="center"
            sx={{
              color: "success.main",
              display: "block",
              mt: 2,
              fontSize: "1.4rem",
            }}
          >
            LIFE: {life}❤️
          </Typography>
          <Typography
            align="center"
            sx={{ color: "customTheme.text2", mt: "5rem" }}
          >
            Redirecting in {timer}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Stack direction="row" spacing={2}>
            <Typography sx={{ color: "success.main" }}>
              Right Answers:{" "}
              <Typography component="span" sx={{ color: "success.main" }}>
                {scores?.right}
              </Typography>{" "}
            </Typography>
            <Typography sx={{ color: "error.main" }}>
              Wrong Answers:{" "}
              <Typography component="span" sx={{ color: "error.main" }}>
                {scores?.wrong}
              </Typography>
            </Typography>
          </Stack>
          <Typography
            align="center"
            sx={{
              display: "block",
              mt: 2,
              fontSize: "1.4rem",
              color: "error.main",
            }}
          >
            LIFE: {life} {"  "}💔
          </Typography>
          <Typography
            align="center"
            sx={{ color: "customTheme.text2", mt: "5rem" }}
          >
            Redirecting in {timer}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default ScoreCard;
