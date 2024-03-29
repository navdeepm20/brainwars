//react
import { useContext, useState } from "react";
//mui
import {
  Stack,
  Typography,
  InputLabel,
  TextField,
  Fade,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//appwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
  getUniqueId,
  Query,
} from "@/utils/appwrite/appwriteConfig";
//njs
import { useRouter } from "next/router";
//context
import { globalContext } from "@/context/GlobalContext";
//internal
import LoadingButton from "../buttons/LoadingBtn";
//utils
import { gameModeId } from "@/utils/constants";
import { customToast, setModeId } from "@/utils/utils";
import { getRandomAvatarUrl } from "@/utils/components/pickGame";

function JoinRoom({ goBackHandler, ...props }) {
  const { setUser, setMetaInfo } = useContext(globalContext);
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const router = useRouter();
  const handleJoinRoom = async (e) => {
    try {
      setIsJoiningRoom(true);
      //find room
      const response = await databases.listDocuments(
        dbIdMappings?.main,
        collectionsMapping.rooms,
        [Query.equal("roomCode", [`${roomCode}`])]
      );
      if (
        response?.total > 0 &&
        response?.documents[0]?.status?.toLowerCase() === "inprogress"
      ) {
        setIsJoiningRoom(false);
        return customToast("Oops.., Game is already started.", "warning");
      }
      if (
        response?.total > 0 &&
        response?.documents[0]?.players?.length >=
          response?.documents[0]?.maxParticipants - 1
      ) {
        customToast("Oops..., Room is full", "error");
      } else if (response?.total > 0) {
        const avatarUrl = await getRandomAvatarUrl();
        //create user
        const userResponse = await databases.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.gamers,
          getUniqueId(),
          {
            isAuthenticated: false,
            name,
            avatarUrl,
          }
        );
        setUser({ name: userResponse?.name, id: userResponse?.$id });
        localStorage.setItem(
          "user",
          JSON.stringify({ name: userResponse?.name, id: userResponse?.$id })
        );
        //find if user already exist
        const findUserResponse = databases.listDocuments(
          dbIdMappings?.main,
          collectionsMapping?.rooms,
          [Query.search("players", userResponse?.$id)]
        );
        //update the room after creating the player
        const roomResponse = await databases.updateDocument(
          dbIdMappings?.main,
          collectionsMapping.rooms,
          response?.documents[0]?.$id,
          {
            players: [...response?.documents[0]?.players, userResponse?.$id],
          }
        );
        //storing in localstorage
        localStorage.setItem(
          "currentGameInfo",
          JSON.stringify({
            roomId: roomResponse?.$id,
            playerId: userResponse?.$id,
            createRoom: false,
          })
        );
        // setRoomInfo(roomResponse);
        setMetaInfo({
          gameMode: "single",
          modeId: gameModeId?.multi,
          isGameStarted: false,
        });
        setModeId(gameModeId?.multi);
        router.push({
          pathname: "/lobby/[lobbyId]",
          query: { lobbyId: `${response?.documents[0]?.$id}` },
        });
      } else {
        customToast("Room not found or invalid room code", "error");
      }

      setIsJoiningRoom(false);
    } catch (err) {
      setIsJoiningRoom(false);
      console.log(err);
      customToast(err?.message, "error");
    }
  };

  return (
    <Fade in={true}>
      <Stack
        sx={{
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.02)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur( 4px )",
          py: 5,
          px: 3,
        }}
      >
        <IconButton
          sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
          onClick={() => {
            const sound = new Audio("/assets/audios/click/button_click.mp3");
            sound.play();
            goBackHandler();
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{ color: "customTheme.text" }}
          align="center"
        >
          Join the Battle
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "customTheme.text2", mb: 4 }}
          align="center"
        >
          Conquer the battleground by joining multiplayer
        </Typography>
        <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter Your Name</InputLabel>
        <TextField
          id="name"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          helperText="Min 5 characters"
          onChange={(e) => setName(e.target.value)}
        />

        <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter Room Code</InputLabel>
        <TextField
          id="name"
          fullWidth
          sx={{ mb: 2 }}
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <LoadingButton
          variant="contained"
          fullWidth
          color="success"
          onClick={handleJoinRoom}
          disabled={name?.trim().length <= 4 || roomCode?.trim().length < 6}
          isLoading={isJoiningRoom}
        >
          Join Room
        </LoadingButton>
      </Stack>
    </Fade>
  );
}

export default JoinRoom;
