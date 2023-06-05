import {
  collectionsMapping,
  dbIdMappings,
  databases,
} from "@/utils/appwrite/appwriteConfig";

//nextjs
import dynamic from "next/dynamic";

//internal
const GameRoomCard = dynamic(() => import("../../components/cards/RoomCard"), {
  ssr: false,
});

function LobbyId({ roomInfo, gameInfo, creatorInfo, ...props }) {
  return (
    <GameRoomCard
      roomInfo={roomInfo}
      gameInfo={gameInfo}
      creatorInfo={creatorInfo}
    />
  );
}

export default LobbyId;

export async function getStaticPaths(context) {
  return {
    paths: [
      {
        params: {
          lobbyId: "1",
        },
      },
    ],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  //get the lobbyData
  const roomInfo = await databases.getDocument(
    dbIdMappings.main,
    collectionsMapping.rooms,
    params?.lobbyId
  );

  //get the game info
  const gameInfo = await databases.getDocument(
    dbIdMappings.main,
    collectionsMapping.games,
    roomInfo.gameId
  );

  //get the creator info
  const creatorInfo = await databases.getDocument(
    dbIdMappings.main,
    collectionsMapping?.gamers,
    roomInfo.creatorId
  );

  return {
    props: {
      roomInfo,
      gameInfo,
      creatorInfo,
    },
  };
}
