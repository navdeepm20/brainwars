import { Chip } from "@mui/material";

interface propTypes {
  fullWidth: boolean;
  noRadius: boolean;
  [props: string]: any;
}
function Chip1({ fullWidth, noRadius, ...props }: propTypes) {
  const sx = props?.sx;
  delete props.sx;
  const customProps = {
    sx: {
      width: fullWidth ? "100%" : "initial",
      borderRadius: noRadius ? 0 : "",
      ...sx,
    },
    ...props,
  };

  return <Chip {...customProps} />;
}

export default Chip1;
