//react
import { useState } from "react";
//mui
import {
  Stack,
  Typography,
  InputLabel,
  TextField,
  Button,
} from "@mui/material";
//appwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
  Query,
} from "@/utils/appwrite/appwriteConfig";
import { useRouter } from "next/router";

function JoinRoom({ ...props }) {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const handleJoinRoom = async (e) => {
    try {
      const response = await databases.listDocuments(
        dbIdMappings?.main,
        collectionsMapping.rooms,
        [Query.equal("roomCode", [`${roomName}`])]
      );

      router.push({
        pathname: "/lobby/[lobbyId]",
        query: { lobbyId: `${response?.documents[0]?.$id}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
      <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter You Name</InputLabel>
      <TextField
        id="name"
        fullWidth
        sx={{ mb: 2 }}
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        color="success"
        onClick={handleJoinRoom}
        disabled={!(roomName?.trim("").length >= 4)}
      >
        Join Room
      </Button>
    </Stack>
  );
}

export default JoinRoom;
