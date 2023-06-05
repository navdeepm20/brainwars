//mui
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
//apwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
} from "@/utils/appwrite/appwriteConfig";
//react
import { useContext, useEffect, useState } from "react";
//internal
import GameCard from "./GameCard";
import Btn1 from "../buttons/Btn1";
import ParticlesBg from "@/components/particlebg";
import StatusIndicator from "@/components/status_indicator";
import PlayerCard from "./PlayerCard";
//context
import { globalContext } from "@/context/GlobalContext";

const GameRoomCard = ({ roomInfo, creatorInfo, gameInfo }) => {
  const { user } = useContext(globalContext);

  const [playersInfo, setPlayersInfo] = useState(null);
  useEffect(() => {
    (async () => {
      setPlayersInfo(
        await Promise.all(
          ["647b1be024c602284240", "647b1a92a5946e962602"]?.map(
            async (player, index) => {
              return await databases?.getDocument(
                dbIdMappings?.main,
                collectionsMapping?.gamers,
                player
              );
            }
          )
        )
      );
    })();
  }, []);

  return (
    <>
      <ParticlesBg />
      <Card
        sx={{
          border: "1px solid #333",
          borderRadius: "8px",
          minWidth: "30rem",
          background: " rgba( 77, 72, 72, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          backdropFilter: "blur( 4px )",
        }}
      >
        <CardContent sx={{ p: "3rem 2rem" }}>
          <Typography
            sx={{
              border: ".1rem solid",
              borderColor: "primary.secondary",
              p: "2rem 3rem",
              backgroundColor: (theme) =>
                alpha(theme.palette.secondary.main, 0.2),
              borderRadius: "8px",
              fontSize: "2rem",
            }}
          >
            Welcome to {creatorInfo?.name}'s Room
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            spacing={1}
          >
            <Typography
              align="center"
              variant="body2"
              sx={{
                textTransform: "uppercase",
                color: "customTheme.text2",
              }}
            >
              STATUS: {roomInfo?.status}
            </Typography>
            <StatusIndicator color="success.main" />
          </Stack>
          <GameCard gameInfo={gameInfo} />
          <Stack rowGap={2}>
            <PlayerCard
              sx={{ mt: 4 }}
              name={creatorInfo?.name}
              isCreator={user?.id === roomInfo?.creatorId}
            />
            {playersInfo?.map((playerInfo, index) => (
              <PlayerCard name={playerInfo?.name} key={index} />
            ))}
          </Stack>

          <Btn1
            sx={{ m: "auto", display: "block", mt: 3, color: "success.main" }}
            disabled={user?.id !== roomInfo?.creatorId}
            title="Only creator can start the game"
          >
            Start Game
          </Btn1>
        </CardContent>
      </Card>
    </>
  );
};

export default GameRoomCard;
