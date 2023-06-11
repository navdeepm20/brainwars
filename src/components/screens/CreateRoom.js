//mui
import {
  Paper,
  Typography,
  Stack,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Box,
  Fade,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//internal

//react
import { useContext, useState } from "react";
//nextjs
import { useRouter } from "next/router";
import LoadingBtn from "../buttons/LoadingBtn";
//utils
import {
  databases,
  dbIdMappings,
  collectionsMapping,
  getUniqueId,
} from "@/utils/appwrite/appwriteConfig";
//context
import { globalContext } from "@/context/GlobalContext";
//utils & helpers
import { generateRoomCode, setModeId } from "@/utils/utils";
//utils
import { gameModeId } from "@/utils/constants";
import { getRandomAvatarUrl } from "@/utils/components/pickGame";

function CreateRoom({ joinRoomHandler, goBackHandler, ...props }) {
  const { games, setUser, setMetaInfo } = useContext(globalContext);
  const [roomName, setRoomName] = useState("");
  const [participants, setParticipants] = useState("1");
  const [gameId, setGameId] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  //handlers
  const handleNameChange = (e) => {
    setRoomName(e.target.value);
  };
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (userName?.length) {
      try {
        setIsCreatingRoom(true);
        const avatarUrl = await getRandomAvatarUrl();
        const response = await databases.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.gamers,
          getUniqueId(),
          {
            name: userName,
            isAuthenticated: false,
            avatarUrl,
          }
        );

        setUser({ name: response?.name, id: response?.$id });
        localStorage.setItem(
          "user",
          JSON.stringify({ name: response?.name, id: response?.$id })
        );
        const createRoomResponse = await databases.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.rooms,
          getUniqueId(),
          {
            roomName,
            gameId: gameId,
            creatorId: response?.$id,
            maxParticipants: participants,
            roomCode: generateRoomCode(),
          }
        );
        //storing in localstorage
        localStorage.setItem(
          "currentGameInfo",
          JSON.stringify({
            roomId: createRoomResponse?.$id,
            playerId: response?.$id,
            playerName: response?.name,
            createRoom: true,
          })
        );

        setMetaInfo({
          gameMode: "single",
          modeId: gameModeId?.multi,
          isGameStarted: false,
        });
        setModeId(gameModeId?.multi);
        router.push({
          pathname: "/lobby/[lobbyId]",
          query: { lobbyId: `${createRoomResponse?.$id}` },
        });
        setIsCreatingRoom(false);
      } catch (err) {
        setIsCreatingRoom(false);
        console.log(err);
      }
    }
  };

  return (
    <Fade in={true}>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "1rem 2rem",
          border: "1px solid #333",
          background: " rgba( 77, 72, 72, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          backdropFilter: "blur( 4px )",
        }}
      >
        <IconButton
          sx={{ justifyContent: "flex-start", alignSelf: "flex-start" }}
          onClick={goBackHandler}
        >
          <ArrowBackIcon />
        </IconButton>
        <form onSubmit={handleCreateRoom} style={{ width: "100%" }}>
          <Typography
            variant="h4"
            mt={6}
            sx={{ color: "customTheme.text" }}
            align="center"
          >
            Let's Have Fun With Friends
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "customTheme.text2", mb: 4 }}
            align="center"
          >
            Create your custom room
          </Typography>

          <Stack direction="row" gap={4}>
            <Box>
              <InputLabel sx={{ mr: "auto", mb: 1 }}>
                Enter Your Name
              </InputLabel>
              <TextField
                id="name"
                fullWidth
                sx={{ mb: 4 }}
                inputProps={{
                  maxLength: "30",
                }}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                helperText="Max 30 char's only"
              />
            </Box>
            <Box>
              <Stack>
                <InputLabel sx={{ mr: "auto", mb: 1 }}>
                  Enter Your Room Name
                </InputLabel>
                <TextField
                  id="room_name"
                  fullWidth
                  sx={{ mb: 4 }}
                  inputProps={{
                    maxLength: "30",
                  }}
                  value={roomName}
                  onChange={handleNameChange}
                  helperText="Max 30 char's only"
                />
              </Stack>
            </Box>
          </Stack>
          <InputLabel sx={{ mr: "auto", mb: 1 }}>
            Enter Number of Participants
          </InputLabel>
          <TextField
            id="name"
            fullWidth
            sx={{ mb: 6 }}
            value={participants}
            onChange={(e) => {
              setParticipants(e.target.value);
            }}
            type="number"
            helperText="Max 10 Participants Only"
          />
          <Select
            fullWidth
            mb={4}
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          >
            {games?.documents?.map((game, index) => (
              <MenuItem key={index} value={game?.$id}>
                {game?.gameName?.toUpperCase()}
              </MenuItem>
            ))}
          </Select>

          <LoadingBtn
            variant="contained"
            fullWidth
            color="success"
            disabled={
              !(userName?.trim("").length >= 4) ||
              participants > 10 ||
              participants < 1 ||
              !(roomName?.trim("").length >= 4) ||
              !(gameId?.trim("").length >= 5)
            }
            type="submit"
            sx={{ mt: 4 }}
            isLoading={isCreatingRoom}
          >
            Create Room
          </LoadingBtn>
        </form>

        <Stack className="join-create" sx={{ mt: 8 }} alignItems="center">
          <Typography sx={{ color: "customTheme.text", mb: 4 }} align="center">
            Don't want to create? Join a room
          </Typography>
          <Stack direction="row" spacing={3}>
            <LoadingBtn
              variant="outlined"
              color="secondary"
              onClick={joinRoomHandler}
            >
              Join Room
            </LoadingBtn>
          </Stack>
        </Stack>
      </Paper>
    </Fade>
  );
}

export default CreateRoom;
