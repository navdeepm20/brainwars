//mui
import { Paper, Box, Typography, TextField, InputLabel } from "@mui/material";
//internal components
import ParticleBg from "@components/particlebg";
import Button from "@components/buttons/Btn1";

import { useState, useContext, useEffect } from "react";
//libs
import {
  databases,
  dbIdMappings,
  collectionsMapping,
} from "../../utils/appwrite/appwriteConfig";

//context
import { globalContext } from "@/context/GlobalContext";

function ClearDb({ games, ...props }) {
  const { setGames } = useContext(globalContext);
  const [name, setName] = useState("");

  useEffect(() => {
    setGames(games);
  }, []);
  //handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleStartGame = async (e) => {
    if (name?.length) {
      // const promise = databases?.createDocument(
      //   dbIdMappings.main,
      //   collectionsMapping.user,
      //   getUniqueId(),
      //   {
      //     name: "Test User",
      //   }
      // );
      // promise.then((response) => {
      //   console.log(response?.$createdAt, response?.$updatedAt);

      const allDocuments = await databases?.listDocuments(
        dbIdMappings?.main,
        name?.trim("")
      );
      await Promise.all(
        allDocuments?.documents?.map(async (document) => {
          return await databases?.deleteDocument(
            dbIdMappings?.main,
            name,
            document?.$id
          );
        })
      );
    }
  };

  return (
    <Box width="100%">
      <ParticleBg />

      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "1rem 2rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.02)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
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

        <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter Collection Id</InputLabel>
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
          Clear Db
        </Button>
      </Paper>
    </Box>
  );
}

export default ClearDb;

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
