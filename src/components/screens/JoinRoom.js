//react
import { useContext, useState } from "react";
//mui
import {
  Stack,
  Typography,
  InputLabel,
  TextField,
  Button,
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

function JoinRoom({ goBackHandler, ...props }) {
  const { setUser } = useContext(globalContext);
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  // const [roomInfo, setRoomInfo] = useState(null);
  const router = useRouter();
  const handleJoinRoom = async (e) => {
    try {
      //create user
      const userResponse = await databases.createDocument(
        dbIdMappings?.main,
        collectionsMapping?.gamers,
        getUniqueId(),
        {
          isAuthenticated: false,
          name,
        }
      );

      setUser({ name: userResponse?.name, id: userResponse?.$id });
      localStorage.setItem(
        "user",
        JSON.stringify({ name: userResponse?.name, id: userResponse?.$id })
      );
      //find room
      const response = await databases.listDocuments(
        dbIdMappings?.main,
        collectionsMapping.rooms,
        [Query.equal("roomCode", [`${roomCode}`])]
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

      router.push({
        pathname: "/lobby/[lobbyId]",
        query: { lobbyId: `${response?.documents[0]?.$id}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fade in={true}>
      <Stack
        sx={{
          border: "1px solid #333",
          background: " rgba( 77, 72, 72, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          backdropFilter: "blur( 4px )",
          py: 5,
          px: 3,
        }}
      >
        <IconButton
          sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
          onClick={goBackHandler}
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
        <Button
          variant="contained"
          fullWidth
          color="success"
          onClick={handleJoinRoom}
          disabled={name?.trim("").length <= 4 || roomCode?.trim("").length < 6}
        >
          Join Room
        </Button>
      </Stack>
    </Fade>
  );
}

export default JoinRoom;
