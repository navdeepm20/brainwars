//mui
import { Box, Typography, Stack } from "@mui/material";

function ScoreCard({ completed, scores, life, ...props }) {
  return (
    <>
      {completed ? (
        <Box mb={3}>
          <Stack direction="row" spacing={2}>
            <Typography sx={{ color: "success.main" }}>
              Right Answers:{" "}
              <Typography variant="span" sx={{ color: "success.main" }}>
                {scores?.right}
              </Typography>{" "}
            </Typography>
            <Typography sx={{ color: "error.main" }}>
              Wrong Answers:{" "}
              <Typography variant="span" sx={{ color: "error.main" }}>
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
        </Box>
      ) : (
        <Box>
          <Stack direction="row" spacing={2}>
            <Typography sx={{ color: "success.main" }}>
              Right Answers:{" "}
              <Typography variant="span" sx={{ color: "success.main" }}>
                {scores?.right}
              </Typography>{" "}
            </Typography>
            <Typography sx={{ color: "error.main" }}>
              Wrong Answers:{" "}
              <Typography variant="span" sx={{ color: "error.main" }}>
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
        </Box>
      )}
    </>
  );
}

export default ScoreCard;
