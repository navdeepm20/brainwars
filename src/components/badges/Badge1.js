import { Badge } from "@mui/material";

function Badge1({ children, ...props }) {
  const sx = props?.sx;
  delete props.sx;
  const customProps = {
    sx: {
      ...sx,
    },
    ...props,
  };
  return <Badge {...customProps}>{children}</Badge>;
}

export default Badge1;
