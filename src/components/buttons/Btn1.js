//mui
import Button from "@mui/material/Button";

function Btn1({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}

export default Btn1;
