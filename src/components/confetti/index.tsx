import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

const ConfettiAnimation = () => {
  const [window, setWindow] = useState();
  useEffect(() => {
    setWindow(window);
  }, []);
  return (
    <Confetti
      width={window?.innerWidth}
      height={window?.innerHeight}
      recycle={true}
      numberOfPieces={200}
    />
  );
};

export default ConfettiAnimation;
