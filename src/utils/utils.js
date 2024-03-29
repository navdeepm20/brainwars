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

export const playSound = (
  soundPath = "/assets/audios/click/button_click.mp3"
) => {
  const sound = new Audio(soundPath);
  sound.play();
};

export const getGameScoreFunctionId = (gameId) => {
  console.log(gameId);
  switch (gameId) {
    case "64d145a0cc7e92844e81": //memory master
      return "64e0a02a6088b749fc1a";
    case "6476533db5284c9d7f9d": //sharpshooter
      return "6485aeaf40916b78b283";
    default:
      return null;
  }
};

export const getGameRoute = (gameId) => {
  console.log(gameId, "from get game router");
  switch (gameId) {
    case "64d145a0cc7e92844e81": //memory master
      return "/memory-master";
    case "6476533db5284c9d7f9d": //sharpshooter
      return "/sharp-shooter";
    default:
      return null;
  }
};
