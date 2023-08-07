//mui
import Button from "@mui/material/Button";

interface propTypes {
  children: string;
  [props: string]: any;
}

function Btn1({ children, ...props }: propTypes) {
  const customProps = {
    ...props,
    onClick: () => {
      const sound = new Audio("/assets/audios/click/button_click.mp3");
      sound.play();
      props?.onClick();
    },
  };

  return <Button {...customProps}>{children}</Button>;
}

export default Btn1;
