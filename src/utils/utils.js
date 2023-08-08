import { toast } from "react-toastify";

export const generateRoomCode = (codeLength = 6) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomCode = "";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters.charAt(randomIndex);
  }

  return roomCode;
};

// export const customToast = (message, (options = {}))=>toast.;

export const customToast = (message, type, options = {}) => {
  switch (type) {
    case "success":
      return toast.success(message, {
        onOpen: () => {
          const audio = new Audio("/assets/audios/notification/simple.mp3");
          audio.play();
        },
        ...options,
      });
    case "error":
      return toast.error(message, {
        onOpen: () => {
          const audio = new Audio("/assets/audios/notification/simple.mp3");
          audio.play();
        },
        ...options,
      });
    case "info":
      return toast.info(message, {
        onOpen: () => {
          const audio = new Audio("/assets/audios/notification/simple.mp3");
          audio.play();
        },
        ...options,
      });
    case "warning":
      return toast.warning(message, {
        onOpen: () => {
          const audio = new Audio("/assets/audios/notification/simple.mp3");
          audio.play();
        },
        ...options,
      });

    default:
      return toast.info(message, {
        onOpen: () => {
          const audio = new Audio("/assets/audios/notification/simple.mp3");
          audio.play();
        },
        ...options,
      });
  }
};

export const getModeId = () => sessionStorage.getItem("mid");
export const setModeId = (id) => sessionStorage.setItem("mid", id);

export const playSound = (soundPath = "/assets/audios/click/button_click.mp3") => {
  const sound = new Audio(soundPath);
  sound.play();
};
