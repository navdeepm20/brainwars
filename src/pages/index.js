//mui
import {
  Paper,
  Box,
  Typography,
  Stack,
  TextField,
  InputLabel,
  Fade,
} from "@mui/material";
//internal components
import ParticleBg from "@components/particlebg";
import CreateRoom from "@/components/screens/CreateRoom";
import JoinRoom from "@/components/screens/JoinRoom";
import Button from "@/components/buttons/LoadingBtn";
//nextjs
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
//libs
import { toast } from "react-toastify";
//context
import { globalContext } from "@/context/GlobalContext";
//utils
import { gameModeId } from "@/utils/constants";
import { setModeId } from "@/utils/utils";
import {
  databases,
  dbIdMappings,
  collectionsMapping,
} from "../utils/appwrite/appwriteConfig";
//sounds
// import notifcationSound from "@public/assets/audios/notification/mario_coin.mp3";

function Index({ games, ...props }) {
  const { setGames, setMetaInfo } = useContext(globalContext);
  const [name, setName] = useState("");
  const router = useRouter();
  const [isCreateRoomActive, setIsCreateRoomActive] = useState(false);
  const [isJoinRoom, setIsJoinRoom] = useState(false);

  useEffect(() => {
    setGames(games);
  }, []);

  //handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleStartGame = (e) => {
    if (name?.length) {
      setMetaInfo({
        gameMode: "single",
        modeId: gameModeId?.single,
        isGameStarted: false,
      });
      setModeId(gameModeId?.single);

      router.push({
        pathname: "/pick-game",
        query: { name },
      });
    }
  };
  const goBackHandler = (e) => {
    setIsJoinRoom(false);
    setIsCreateRoomActive(false);
  };

  return (
    <Fade in={true}>
      <Box width="100%">
        <ParticleBg />
        {!isCreateRoomActive && !isJoinRoom ? (
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
            <Typography
              variant="h4"
              mt={6}
              sx={{ color: "customTheme.text" }}
              align="center"
            >
              Welcome to BrainGames
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "customTheme.text2", mb: 4 }}
              align="center"
            >
              Let&apos;s start the Fun
            </Typography>

            <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter You Name</InputLabel>
            <TextField
              id="name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={handleNameChange}
            />
            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={handleStartGame}
              disabled={!(name?.trim("").length >= 4)}
            >
              Continue
            </Button>
            <Stack className="join-create" sx={{ mt: 8 }} alignItems="center">
              <Typography
                sx={{ color: "customTheme.text", mb: 4 }}
                align="center"
              >
                Let&apso;s have more fun with multiplayer battles
              </Typography>
              <Stack direction="row" spacing={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={(e) => setIsCreateRoomActive(true)}
                >
                  Create Room
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={(e) => setIsJoinRoom(true)}
                >
                  Join Room
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ) : isCreateRoomActive ? (
          <CreateRoom
            goBackHandler={goBackHandler}
            joinRoomHandler={(e) => {
              setIsCreateRoomActive(false);
              setIsJoinRoom(true);
            }}
          />
        ) : (
          isJoinRoom && (
            <JoinRoom
              goBackHandler={goBackHandler}
              createRoomHandler={(e) => {
                setIsJoinRoom(false);
                setIsCreateRoomActive(true);
              }}
            />
          )
        )}
      </Box>
    </Fade>
  );
}

export default Index;

export async function getStaticProps() {
  const response = await databases.listDocuments(
    dbIdMappings.main,
    collectionsMapping.games
  );
  return {
    props: {
      games: response,
    },
  };
}
