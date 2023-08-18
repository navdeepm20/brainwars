//mui
import { Box, Typography } from "@mui/material";

type PropTypes = {
  additionalComponent?: React.ReactNode;
  sx?: object;
  [props: string]: any;
};

function GameCompleted({ addtionalComponent, sx, ...props }: PropTypes) {
  return (
    <Box sx={{ ...sx }}>
      <Typography mt={1} mb={2} align="center">
        Congratulation's 🎉
      </Typography>
      <Typography sx={{ fontSize: "3rem", mb: "3rem" }}>
        GAME COMPLETED
      </Typography>
      {addtionalComponent}
    </Box>
  );
}

export default GameCompleted;
