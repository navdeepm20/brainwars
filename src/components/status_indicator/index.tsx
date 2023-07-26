import { Box } from "@mui/material";

interface propTypes {
  color?: string;
  [props: string]: any;
}
function index({ color, ...props }) {
  return (
    <Box
      sx={{
        width: "1rem",
        height: "1rem",
        backgroundColor: color ? color : "primary.main",
        borderRadius: "50%",
      }}
    ></Box>
  );
}

export default index;
