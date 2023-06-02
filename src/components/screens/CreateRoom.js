//mui
import { Paper, Typography, Stack, InputLabel, TextField } from "@mui/material";

//react
import { useState } from "react";
//nextjs
import { useRouter } from "next/router";
import Btn1 from "../buttons/Btn1";
//utils
import {
  databases,
  dbIdMappings,
  collectionsMapping,
} from "@/utils/appwrite/appwriteConfig";

function CreateRoom({ ...props }) {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState("");
  const router = useRouter();
  //handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleCreateRoom = (e) => {
    e.preventDefault();

    if (name?.length) {
      //   router.push({
      //     pathname: "/pick-game",
      //     query: { name },
      //   });
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
        background: "transparent",
      }}
    >
      <form onSubmit={() => alert("kajsdfkljasldjfklasjdf lasjdf")}>
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
        <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter Your Room Name</InputLabel>
        <TextField
          id="name"
          fullWidth
          sx={{ mb: 4 }}
          inputProps={{
            maxLength: "30",
          }}
          value={name}
          onChange={handleNameChange}
          helperText="Max 30 char's only"
        />
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

        <Btn1
          variant="contained"
          fullWidth
          color="success"
          onClick={handleCreateRoom}
          disabled={
            !(name?.trim("").length >= 4) ||
            participants > 10 ||
            participants < 1
          }
          type="submit"
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
