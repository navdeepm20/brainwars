//mui
import Button from "@mui/material/Button";

function Btn1({ children, ...props }) {
  const customProps = {
    ...props,
    onClick: () => {
      const sound = new Audio("/assests/audios/click/button_click.mp3");
      sound.play();
      props?.onClick();
    },
  };

  return <Button {...customProps}>{children}</Button>;
}

export default Btn1;
