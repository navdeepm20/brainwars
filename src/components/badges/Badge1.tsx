import { Badge } from "@mui/material";

interface propTypes {
  children: React.ReactNode;
  [props: string]: any;
}
function Badge1({ children, ...props }: propTypes) {
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
