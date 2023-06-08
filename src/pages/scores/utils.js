import {
  Query,
  collectionsMapping,
  databases,
  dbIdMappings,
} from "@/utils/appwrite/appwriteConfig";

export const getScore = async (sessionId) => {
  console.log(sessionId, "asdf");
  return await databases?.listDocuments(
    dbIdMappings?.main,
    collectionsMapping?.scores,
    [Query.search("gameSessionId", sessionId)]
  );
};

export const fetchScoresInfo = async (gameSessions) => {
  console.log(gameSessions);
  return await Promise.all(
    gameSessions?.map(async (session, index) => await getScore(session?.$id))
  );
};
export const getGameSession = async (session) =>
  await databases?.getDocument(
    dbIdMappings?.main,
    collectionsMapping?.game_session,
    session
  );

export const fetchGameSessionsInfo = async (gameSessions) => {
  return await Promise.all(
    gameSessions?.map(async (session, index) => await getGameSession(session))
  );
};

export const fetchPlayerInfo = async (playerId) => {
  return await databases?.getDocument(
    dbIdMappings?.main,
    collectionsMapping?.gamers,
    playerId
  );
};

export const fetchCreatorsInfo = async (gameSessionsArray) => {
  return await Promise.all(
    gameSessionsArray?.map(
      async (session, index) => await fetchPlayerInfo(session?.creatorId)
    )
  );
};

export const fetchGameInfo = async (gameId) => {
  return await databases?.getDocument(
    dbIdMappings?.main,
    collectionsMapping?.games,
    gameId
  );
};

export const fetchRoomInfo = async (roomId) => {
  return await databases?.getDocument(
    dbIdMappings?.main,
    collectionsMapping?.rooms,
    roomId
  );
};

export const calculateScores = (scoresArray, gameSessionArray, roomInfo) => {
  let calculatedScoresArray = [];
  gameSessionArray?.map((session) => {
    const foundScore = scoresArray?.find((scoreInfo) => {
      if (scoreInfo?.total) {
        console.log(scoreInfo?.documents[0]?.gameSessionId, session?.$id);
        return scoreInfo?.documents[0]?.gameSessionId === session?.$id;
      } else {
        console.log("not found ");
      }
    });
    calculatedScoresArray.push({
      playerName: session?.creatorName,
      playerId: session?.creatorId,
      score: foundScore?.documents[0]?.score,
      isCreator: session?.creatorId === roomInfo?.creatorId,
    });
    calculatedScoresArray = calculatedScoresArray.sort((a, b) => {
      return b?.score - a?.score;
    });
  });
  return calculatedScoresArray;
};
