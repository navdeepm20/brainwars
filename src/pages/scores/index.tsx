//mui

import { Card, CardContent, Stack, Typography, alpha } from "@mui/material";

//react
import { useEffect, useRef, useState } from "react";
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
  getScore,
  getPlayerInfo,
  getGameSession,
} from "@/utils/components/scores";

import {
  functions,
  databases,
  dbIdMappings,
  collectionsMapping,
  client,
} from "@/utils/appwrite/appwriteConfig";

//internal
import ConfettiAnimation from "@/components/confetti";
import { customToast, getGameScoreFunctionId, getModeId } from "@/utils/utils";
import { gameModeId } from "@/utils/constants";

//node
import { ParsedUrlQuery } from "querystring";

interface propTypes extends ParsedUrlQuery {
  rid: string;
  gsid: string;
}
function index({ ...props }) {
  const router = useRouter();

  const { rid: roomId, gsid: gameSessionId } = router.query as propTypes;
  const [gameInfo, setGameInfo] = useState({});
  const [isGettingData, setIsGettingData] = useState(true);
  const [finalScores, setFinalScores] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [gameSessionsInfo, setGameSessionsInfo] = useState([]);
  const [isScoreCalculated, setIsScoreCalculated] = useState(false);

  const playVictorySound = () => {
    const audio = new Audio("/assets/audios/victory/victory.mp3");
    audio.play();
  };

  useEffect(() => {
    //update the session status to completed
    if (gameSessionId) {
      (async () => {
        try {
          await databases.updateDocument(
            dbIdMappings?.main,
            collectionsMapping?.game_session,
            gameSessionId,
            {
              status: "Completed",
            }
          );
        } catch (err) {
          customToast(err.message, "error");
        }
      })();
    } else {
      // customToast("Game session not found", "error");
    }
  }, []);

  useEffect(() => {
    if (getModeId() === gameModeId?.multi && roomId && gameSessionId) {
      (async () => {
        try {
          setIsGettingData(true);
          const roomInfo = await fetchRoomInfo(roomId);
          setRoomInfo(roomInfo);

          const allLinkedGameSessions = await fetchGameSessionsInfo(
            roomInfo?.gameSessions
          );

          if (allLinkedGameSessions?.length) {
            const InProgressSession = allLinkedGameSessions?.find((session) => {
              return session?.data?.status?.toLowerCase() === "inprogress";
            });
            if (InProgressSession) {
              customToast("Few Players are still playing. Please Wait", "info");
            }
          }

          const allGameSessionsLinked = await Promise.all(
            allLinkedGameSessions?.map(async (session) => {
              const playerInfo = await getPlayerInfo(session?.creatorId);
              return {
                id: session?.$id,
                avatarUrl: playerInfo?.avatarUrl,
                data: session,
              };
            })
          );
          setGameSessionsInfo(allGameSessionsLinked);

          const gameInfo = await fetchGameInfo(roomInfo?.gameId);
          setGameInfo(gameInfo);

          setIsGettingData(false);
        } catch (err) {
          customToast(err?.message, "error");
          setIsGettingData(false);
        }
      })();
    } else if (getModeId() === gameModeId?.single && !roomId && gameSessionId) {
      (async () => {
        const scoresInfo = await getScore(gameSessionId);
        const gameSessionInfo = await getGameSession(gameSessionId);

        const gameInfo = await fetchGameInfo(gameSessionInfo?.gameId);
        setGameInfo(gameInfo);
        const playerInfo = await getPlayerInfo(gameSessionInfo?.creatorId);

        //cloud function to calculate the scores.

        functions
          .createExecution(
            getGameScoreFunctionId(gameSessionInfo?.gameId),
            JSON.stringify({
              mode: "single",
              data: { ...JSON.parse(gameSessionInfo.extras), playerInfo },
            })
          )
          .then((response) => {
            const parsedData = JSON.parse(response?.response);

            setFinalScores(parsedData?.scoreInfo); // Handle the function execution response
            setIsGettingData(false);
            setIsScoreCalculated(true);
            customToast("Scores Calculated", "success");
            playVictorySound();
          })
          .catch((error) => {
            customToast(error?.message, "error");
            setIsGettingData(false);
          });
      })();
    } else {
      // customToast("Something went wrong. Please reload or try again.", "error");
    }
  }, [router]);

  useEffect(() => {
    if (roomInfo?.gameSessions?.length) {
      roomInfo?.gameSessions?.forEach((element) => {
        client.subscribe(
          `databases.${dbIdMappings.main}.collections.${collectionsMapping?.game_session}.documents.${element}`,
          (response) => {
            setGameSessionsInfo((prev) => {
              const sessions = prev.map((session) => {
                if (session?.id === element) {
                  return { ...session, data: response.payload };
                }
                return session;
              });

              return sessions;
            });
          }
        );
      });
    }
  }, [roomInfo]);

  useEffect(() => {
    if (gameSessionsInfo?.length) {
      if (
        !gameSessionsInfo?.find(
          (session) => session.data?.status?.toLowerCase() === "inprogress"
        )
      ) {
        customToast("Calulating your scores", "info");
        (async () => {
          const allLinkedGameSessions = await fetchGameSessionsInfo(
            roomInfo?.gameSessions
          );
          const allLinkedPlayersScores = await fetchScoresInfo(
            allLinkedGameSessions
          );
          console.log(gameSessionsInfo);
          functions
            .createExecution(
              getGameScoreFunctionId(gameSessionsInfo[0]?.data?.gameId),
              JSON.stringify({
                mode: "multi",
                data: {
                  allLinkedPlayersScores,
                  allLinkedGameSessions,
                  roomInfo,
                },
              })
            )
            .then((response) => {
              const parsedData = JSON.parse(response?.response);

              setFinalScores(parsedData?.scoreInfo); // Handle the function execution response
              setIsGettingData(false);
              setIsScoreCalculated(true);
              playVictorySound();
              customToast("Scores Calculated", "success");
            })
            .catch((error) => {
              customToast(error?.message, "error");
              setIsGettingData(false);
            });
        })();
      } else {
        // customToast("Some players are still playing", "info");
      }
    }
  }, [gameSessionsInfo]);

  return (
    <>
      <ParticlesBg />
      {isScoreCalculated && <ConfettiAnimation />}
      <Card
        sx={{
          border: "1px solid #333",
          borderRadius: "8px",
          minWidth: "35rem",
          width: "100%",
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
              {!finalScores?.length
                ? gameSessionsInfo?.map((session, index) => {
                    return (
                      <PlayerCard
                        avatarUrl={session?.avatarUrl}
                        name={session?.data?.creatorName}
                        key={index}
                        isCreator={
                          session?.data?.creatorId === roomInfo?.creatorId
                        }
                        // isWinner={index === 0}
                        score={session?.data?.score}
                        isPlaying={
                          session?.data?.status?.toLowerCase() === "inprogress"
                        }
                      />
                    );
                  })
                : finalScores?.map((score, index) => {
                    return (
                      <PlayerCard
                        avatarUrl={score?.avatarUrl}
                        name={score?.playerName}
                        key={index}
                        isCreator={score?.playerId === roomInfo?.creatorId}
                        isWinner={index === 0}
                        score={score?.finalScore}
                        isPlaying={false}
                      />
                    );
                  })}
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
