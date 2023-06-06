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

function LobbyId({ ...props }) {
  return <GameRoomCard />;
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

  return {
    props: {
      roomInfo,
    },
  };
}
