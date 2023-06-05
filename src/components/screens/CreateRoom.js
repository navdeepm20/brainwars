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
} from "@mui/material";

//react
import { useContext, useState } from "react";
//nextjs
import { useRouter } from "next/router";
import Btn1 from "../buttons/Btn1";
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
import { generateRoomCode } from "@/utils/utils";

function CreateRoom({ ...props }) {
  const { games, setUser } = useContext(globalContext);

  const [roomName, setRoomName] = useState("");
  const [participants, setParticipants] = useState("1");
  const [gameId, setGameId] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  //handlers
  const handleNameChange = (e) => {
    setRoomName(e.target.value);
  };
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (userName?.length) {
      //   router.push({
      //     pathname: "/pick-game",
      //     query: { name },
      //   });
      try {
        const response = await databases.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.gamers,
          getUniqueId(),
          {
            name: userName,
            isAuthenticated: false,
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
        router.push({
          pathname: "/lobby/[lobbyId]",
          query: { lobbyId: `${createRoomResponse?.$id}` },
        });
      } catch (err) {
        console.log(err);
      }

      //   const promise = databases.createDocument(
      //     dbIdMappings.main,
      //     collectionsMapping.rooms,
      //     getUniqueId(),
      //     {
      //       roomName: name,
      //       gameId: "", //todo: add option to select game
      //       creatorId: "", // todo: assign temp creator id and create temp user table.
      //     }
      //   );
    }
  };

  return (
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
      <form
        onSubmit={() => alert("kajsdfkljasldjfklasjdf lasjdf")}
        style={{ width: "100%" }}
      >
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
            <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter Your Name</InputLabel>
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

        <Btn1
          variant="contained"
          fullWidth
          color="success"
          onClick={handleCreateRoom}
          disabled={
            !(userName?.trim("").length >= 4) ||
            participants > 10 ||
            participants < 1
          }
          type="submit"
          sx={{ mt: 4 }}
        >
          Create Room
        </Btn1>
      </form>

      <Stack className="join-create" sx={{ mt: 8 }} alignItems="center">
        <Typography sx={{ color: "customTheme.text", mb: 4 }} align="center">
          Don't want to create? Join a room
        </Typography>
        <Stack direction="row" spacing={3}>
          <Btn1 variant="outlined" color="secondary">
            Join Room
          </Btn1>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CreateRoom;
