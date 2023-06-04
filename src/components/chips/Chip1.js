import { Chip } from "@mui/material";

function Chip1({ fullWidth, noRadius, ...props }) {
  const sx = props?.sx;
  delete props.sx;
  const customProps = {
    sx: {
      width: fullWidth ? "100%" : "intial",
      borderRadius: noRadius ? 0 : "",
      ...sx,
    },
    ...props,
  };

  return <Chip {...customProps} />;
}

export default Chip1;
