import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

const LoadingButton = ({
  isLoading,
  onClick,
  children,
  circularProgressProps,
  ...props
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const playClickSound = (e) => {
    const sound = new Audio("/assests/audios/click/button_click.mp3");
    sound.play();
  };
  const handleClick = async () => {
    setButtonDisabled(true);
    playClickSound();
    await onClick();
    setButtonDisabled(false);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={isLoading || buttonDisabled}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <CircularProgress
          size={24}
          color="inherit"
          {...circularProgressProps}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
LoadingButton.defaultProps = {
  isLoading: false,
  onClick: () => {},
  children: <></>,
  circularProgressProps: {},
};
