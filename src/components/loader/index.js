//mui
import { CircularProgress, Paper, Typography } from "@mui/material";

function index({ message, disableMessage, disableMinHeight, ...props }) {
  return (
    <Paper
      elevation={0}
      sx={{
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: disableMinHeight ? 0 : "20rem",
        py: 2,
        ...props?.sx,
      }}
    >
      {!disableMessage && (
        <Typography sx={{ color: "customTheme.text", fontSize: "2rem" }} mb={2}>
          {message}
        </Typography>
      )}
      <CircularProgress />
    </Paper>
  );
}
index.defaultProps = {
  message: "Loading...",
};

export default index;
