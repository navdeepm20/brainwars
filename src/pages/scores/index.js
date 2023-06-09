//mui
//mui
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

//react
import { useEffect, useState } from "react";
//internal
import GameCard from "@/components/cards/GameCard";
import Btn1 from "@/components/buttons/Btn1";
import ParticlesBg from "@/components/particlebg";
import PlayerCard from "@/components/cards/PlayerCard";
import Loader from "@/components/loader";

//njs
import { useRouter } from "next/router";
//utils
import {
  fetchGameInfo,
  fetchRoomInfo,
  fetchGameSessionsInfo,
  fetchScoresInfo,
  calculateMultiPlayerScores,
  calculateSinglePlayerScores,
  getScore,
  getPlayerInfo,
  getGameSession,
} from "@/utils/components/scores";

//internal
import ConfettiAnimation from "@/components/confetti";

function index({ ...props }) {
  const router = useRouter();
  const { rid: roomId, gsid: gameSessionId } = router.query;

  const [gameInfo, setGameInfo] = useState({});

  const [isGettingData, setIsGettingData] = useState(true);
  const [finalScores, setFinalScores] = useState(null);

  useEffect(() => {
    if (roomId) {
      (async () => {
        try {
          setIsGettingData(true);
          const roomInfo = await fetchRoomInfo(roomId);

          const allLinkedGameSessions = await fetchGameSessionsInfo(
            roomInfo?.gameSessions
          );

          const gameInfo = await fetchGameInfo(roomInfo?.gameId);
          setGameInfo(gameInfo);

          const allLinkedPlayersScores = await fetchScoresInfo(
            allLinkedGameSessions
          );

          const finalCalculatedScores = calculateMultiPlayerScores(
            allLinkedPlayersScores,
            allLinkedGameSessions,
            roomInfo
          );

          setFinalScores(finalCalculatedScores);

          setIsGettingData(false);
        } catch (err) {
          console.log(err);
          setIsGettingData(false);
        }
      })();
    } else if (gameSessionId) {
      (async () => {
        const scoresInfo = await getScore(gameSessionId);
        const gameSessionInfo = await getGameSession(gameSessionId);
        const gameInfo = await fetchGameInfo(gameSessionInfo?.gameId);
        setGameInfo(gameInfo);
        const playerInfo = await getPlayerInfo(gameSessionInfo?.creatorId);
        const finalCalculatedScores = calculateSinglePlayerScores(
          scoresInfo?.documents[0]?.score,
          playerInfo
        );
        setFinalScores(finalCalculatedScores);
        setIsGettingData(false);
      })();
    }
  }, [router]);
  return (
    <>
      <ParticlesBg />
      {!isGettingData && <ConfettiAnimation />}
      <Card
        sx={{
          border: "1px solid #333",
          borderRadius: "8px",
          minWidth: "60rem",
          maxWidth: "60rem",
          background: " rgba( 77, 72, 72, 0.25 )",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          backdropFilter: "blur( 4px )",
        }}
      >
        {isGettingData ? (
          <Loader message="Calculating your scores..." />
        ) : (
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
              align="center"
            >
              Your Scores
            </Typography>

            <GameCard gameInfo={gameInfo} />
            <Stack rowGap={2} mt={4}>
              {finalScores?.map((score, index) => (
                <PlayerCard
                  name={score?.playerName}
                  key={index}
                  isCreator={score?.isCreator}
                  isWinner={index === 0}
                  score={score?.score}
                />
              ))}
            </Stack>

            <Btn1
              sx={{ m: "auto", display: "block", mt: 3, color: "success.main" }}
              title="Go back to home"
              onClick={() => {
                router.push("/");
              }}
            >
              Back to Home
            </Btn1>
          </CardContent>
        )}
      </Card>
    </>
  );
}

export default index;
