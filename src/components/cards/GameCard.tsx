import { Stack, Typography, Box } from "@mui/material";

interface propTypes {
  gameInfo: any;
  sx?: {};
  [props: string]: any;
}
function GameCard({ gameInfo, sx, ...props }: propTypes) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        mt: 4,
        ...sx,
      }}
    >
      <Stack justifyContent="center">
        <Typography
          sx={{
            textTransform: "uppercase",
            color: "customTheme.text2",
            fontSize: "1.4rem",
          }}
        >
          GAME
        </Typography>
        <Typography sx={{ fontSize: "1.4rem", textTransform: "capitalize" }}>
          {gameInfo?.gameName}
        </Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography
          align="center"
          sx={{
            textTransform: "uppercase",
            color: "customTheme.text2",
            fontSize: "1.4rem",
          }}
        >
          MAX LIFE &apos; S
        </Typography>
        <Typography
          align="center"
          sx={{ fontSize: "1.4rem", textTransform: "capitalize" }}
        >
          {gameInfo?.maxLifes}
        </Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography
          align="center"
          sx={{
            textTransform: "uppercase",
            color: "customTheme.text2",
            fontSize: "1.4rem",
          }}
        >
          GAME TYPE
        </Typography>
        <Typography
          align="center"
          sx={{ fontSize: "1.4rem", textTransform: "capitalize" }}
        >
          {gameInfo?.gameType}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default GameCard;
