//mui
import { CircularProgress, Paper, Typography } from "@mui/material";

type loaderPropTypes = {
  message?: string;
  disableMessage?: boolean;
  disableMinHeight?: boolean;
  [props: string]: any;
};
function Loader({
  message,
  disableMessage,
  disableMinHeight,
  ...props
}: loaderPropTypes) {
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
Loader.defaultProps = {
  message: "Loading...",
};

export default Loader;
