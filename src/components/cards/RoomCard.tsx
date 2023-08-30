//mui
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
//apwrite
import {
  collectionsMapping,
  databases,
  dbIdMappings,
  client,
  getUniqueId,
  Query,
} from "@/utils/appwrite/appwriteConfig";
//react
import { useContext, useEffect, useState } from "react";
//internal
import GameCard from "./GameCard";
import Btn1 from "../buttons/Btn1";
import ParticlesBg from "@/components/particlebg";
import StatusIndicator from "@/components/status_indicator";
import PlayerCard from "./PlayerCard";
import Loader from "@/components/loader";
//context
import { globalContext } from "@/context/GlobalContext";
//njs
import { useRouter } from "next/router";
import { customToast, getGameRoute } from "@/utils/utils";

//types
type gameInfo = {
  $id: string;
  name: string;
};
type roomData = {
  $id: string;
  roomName: string;
  gameSessions: string[];
  roomCode: string;
  maxParticipants: number;
  gameId: number;
  status: string;
  players: string[];
  creatorId: string;
};
type creatorInfo = {
  $id: string;
  name: string;
  creatorId: string;
  avatarUrl: string;
};

const GameRoomCard = ({ ...props }) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { user, setUser } = useContext(globalContext);
  const [playersInfo, setPlayersInfo] = useState(null);
  const [roomData, setRoomData] = useState<roomData | null>(null);
  const [gameInfo, setGameInfo] = useState<gameInfo | null>(null);
  const [creatorInfo, setCreatorInfo] = useState<creatorInfo | null>();
  const [isGettingData, setIsGettingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [timeoutTime, setTimeoutTime] = useState(10);
  const [isGameAlreadyStarted, setIsGameAlreadyStarted] = useState(false);
  const [lobbyInfo, setLobbyInfo] = useState(null);

  useEffect(() => {
    if (lobbyId)
      (async () => {
        const response = await databases?.getDocument(
          dbIdMappings?.main,
          collectionsMapping?.rooms,
          lobbyId
        );
        setLobbyInfo(response);
      })();
  }, [lobbyId]);
  //handlers
  const handleStartGame = async () => {
    try {
      setIsSubmitting(true);
      //update room status

      //create gameSession for creator
      const creatorGameSession = await databases.createDocument(
        dbIdMappings.main,
        collectionsMapping.game_session,
        getUniqueId(),
        {
          gameId: gameInfo?.$id,
          creatorName: creatorInfo?.name,
          creatorId: roomData?.creatorId,
          roomId,
        }
      );

      //create session for all players
      const gameSessionResponses = await Promise.all(
        playersInfo?.map(async (player, index) => {
          const response = await databases.createDocument(
            dbIdMappings.main,
            collectionsMapping.game_session,
            getUniqueId(),
            {
              gameId: gameInfo?.$id,
              creatorName: player?.name,
              creatorId: player?.$id,
              roomId,
            }
          );
          return response?.$id;
        })
      );

      await databases?.updateDocument(
        dbIdMappings?.main,
        collectionsMapping?.rooms,
        roomId,
        {
          status: "InProgress",
          gameSessions: [...gameSessionResponses, creatorGameSession?.$id],
        }
      );
    } catch (err) {
      setIsSubmitting(false);
      customToast(err?.message, "error");
    }
  };
  //for timer
  const [timerId, setTimerId] = useState(null);

  //start timer
  const startGameTimer = () => {
    setStartTimer(true);
    const id = setInterval(() => {
      setTimeoutTime((prev) => prev - 1);
    }, 1000); // Start the timer
    setTimerId(id);
  };
  //start game
  const startGame = async () => {
    await handleStartGame();
    !isGameAlreadyStarted && startGameTimer();
  };

  //for clear interval
  useEffect(() => {
    return () => {
      clearTimeout(timerId); // Clear the timer on component unmount
    };
  }, [timerId]);

  //for handling timeout time and room data
  useEffect(() => {
    (async () => {
      if (timeoutTime === 0) {
        clearInterval(timerId);

        if (roomData?.gameSessions?.length) {
          const gameSessions = roomData?.gameSessions || [];

          const gameSessionPromises = gameSessions.map(
            async (session: string) => {
              return await databases?.getDocument(
                dbIdMappings?.main,
                collectionsMapping?.game_session,
                session,
                [Query.search("gameSessions", [session])]
              );
            }
          );

          const gameSessionsData = await Promise.all(gameSessionPromises);
          const userSession = gameSessionsData.find(
            (session) => session?.creatorId === user?.id
          );
          console.log(
            {
              pathname: getGameRoute(lobbyInfo?.gameId),
              query: {
                gsid: userSession?.$id,
                gid: userSession?.gameId,
                rId: roomId,
              },
            },
            "from room card",
            lobbyInfo?.gameId,
            lobbyInfo
          );

          if (userSession) {
            router.push({
              pathname: getGameRoute(lobbyInfo?.gameId),
              query: {
                gsid: userSession?.$id,
                gid: userSession?.gameId,
                rId: roomId,
              },
            });
          }
        } else {
          customToast("Game Session not found", "error");
        }
      }
    })();
  }, [timeoutTime, roomData]);

  //for fetching room,game and creator info.
  useEffect(() => {
    (async () => {
      try {
        const roomInfo = await databases.getDocument(
          dbIdMappings.main,
          collectionsMapping.rooms,
          router?.asPath.split("lobby/")[1]
        );
        if (roomInfo?.status?.toLowerCase() === "completed") {
          return customToast(
            "Game already completed. Please create or join a new room",
            "warning"
          );
        }
        const gameInfo = await databases.getDocument(
          dbIdMappings.main,
          collectionsMapping.games,
          roomInfo.gameId
        );
        if (roomInfo?.status.toLowerCase() === "inprogress") {
          customToast("Oops..Game already started.", "warning");
          setIsGameAlreadyStarted(true);
        }
        setRoomData(roomInfo);
        setRoomId(roomInfo?.$id);

        //get the game info

        setGameInfo(gameInfo);

        //get the creator info
        const creatorInfo = await databases.getDocument(
          dbIdMappings.main,
          collectionsMapping?.gamers,
          roomInfo.creatorId
        );
        setCreatorInfo(creatorInfo);
      } catch (err) {
        customToast(err?.message, "error");
      } finally {
        setIsGettingData(false);
      }
    })();
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    return () => {
      if (roomId) {
        try {
          databases.updateDocument(
            dbIdMappings?.main,
            collectionsMapping.rooms,
            roomId,
            {
              players: roomData?.players?.filter((playerId) => {
                return playerId !== user?.playerId;
              }),
            }
          );
        } catch (err) {}
      }
    };
  }, [roomId]);

  //for getting the players info
  useEffect(() => {
    if (
      roomData?.status?.toLowerCase() === "inprogress" &&
      !isGameAlreadyStarted
    ) {
      startGameTimer();
    }
    (async () => {
      setPlayersInfo(
        roomData?.$id
          ? await Promise.all(
              roomData?.players?.map(async (player, index) => {
                return await databases?.getDocument(
                  dbIdMappings?.main,
                  collectionsMapping?.gamers,
                  player
                );
              })
            )
          : []
      );
    })();
  }, [roomData]);

  //for subscribing realtime room updates
  useEffect(() => {
    if (roomData?.$id)
      client.subscribe(
        `databases.${dbIdMappings.main}.collections.${collectionsMapping?.rooms}.documents.${roomData?.$id}`,
        (response: { payload: roomData }) => {
          setRoomData(response?.payload);
        }
      );
  }, [roomData]);

  return (
    <>
      <ParticlesBg />
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
          <Loader />
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
              Welcome to {creatorInfo?.name}&apos;s Room
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Stack justifyContent="flex-start">
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: "uppercase",
                      color: "customTheme.text2",
                      mr: "1rem",
                    }}
                  >
                    STATUS: {roomData?.status}
                  </Typography>
                  {roomData?.status && <StatusIndicator color="success.main" />}
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: "uppercase",
                    color: "customTheme.text2",
                  }}
                >
                  MAX PLAYERS: {roomData?.maxParticipants}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "customTheme.text2",
                }}
                onMouseOver={(e) => setIsTooltipOpen(false)}
              >
                CODE: {roomData?.roomCode}{" "}
                <Tooltip title="Copied to Clipboard" arrow open={isTooltipOpen}>
                  <IconButton
                    onClick={(e) => {
                      window?.navigator?.clipboard.writeText(
                        roomData?.roomCode
                      );
                      setIsTooltipOpen(true);
                    }}
                  >
                    <ContentCopyIcon
                      sx={{ color: "customTheme.text2" }}
                      fontSize="small"
                    />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Stack>
            <GameCard gameInfo={gameInfo} />
            <Stack rowGap={2}>
              {creatorInfo && (
                <PlayerCard
                  sx={{ mt: 4 }}
                  name={creatorInfo?.name}
                  avatarUrl={creatorInfo?.avatarUrl}
                  isCreator={true}
                />
              )}
              {playersInfo?.map((playerInfo, index) => (
                <PlayerCard
                  name={playerInfo?.name}
                  key={index}
                  avatarUrl={playerInfo?.avatarUrl}
                />
              ))}
            </Stack>

            <Btn1
              sx={{ m: "auto", display: "block", mt: 3, color: "success.main" }}
              disabled={user?.id !== roomData?.creatorId || isSubmitting}
              title="Only creator can start the game"
              onClick={
                !isGameAlreadyStarted && user?.id === roomData?.creatorId
                  ? startGame
                  : () => {
                      router.push("/");
                    }
              }
            >
              {!isGameAlreadyStarted ? "Start Game" : "Go Back"}
            </Btn1>
            {startTimer && (
              <Typography align="center" sx={{ color: "customTheme.text2" }}>
                Starting In {timeoutTime}
              </Typography>
            )}
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default GameRoomCard;
