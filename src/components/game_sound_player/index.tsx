import { useState, useRef, useEffect } from "react";
//mui
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

interface PropsType {
  musicPath: string;
  sx?: object;
  defaultPlay?: boolean;
  [props: string]: any;
}

function GameSoundPlayer({
  musicPath,
  sx,
  defaultPlay = true,
  ...props
}: PropsType) {
  const [shouldPlayTheme, setShouldPlayTheme] = useState(defaultPlay);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMounted = useRef(false);
  const handleAudioPlayBack = () => {
    setShouldPlayTheme((prev) => {
      if (prev) {
        audioRef?.current?.pause();
      } else {
        audioRef?.current?.play();
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (!isMounted.current) {
      if (shouldPlayTheme) {
        audioRef?.current?.play();
      }
    }
    return () => {
      if (isMounted.current) handleAudioPlayBack();
      isMounted.current = true;
    };
  }, []);

  return (
    <IconButton onClick={handleAudioPlayBack} sx={{ mb: 2, ...sx }}>
      {shouldPlayTheme ? (
        <VolumeUpIcon titleAccess="Click Stop Audio" />
      ) : (
        <VolumeOffIcon titleAccess="Click Play Audio" />
      )}
      <audio
        src={musicPath}
        ref={audioRef}
        autoPlay={shouldPlayTheme}
        loop={true}
      ></audio>
    </IconButton>
  );
}

export default GameSoundPlayer;
