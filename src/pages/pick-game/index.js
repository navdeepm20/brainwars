//mui
import { Paper, Container, Typography, Stack, ButtonBase,CircularProgress } from "@mui/material";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
//internal components
import ParticleBg from "@components/particlebg";
//nextjs
import { useRouter } from "next/router";
//utils
import {
  databases,
  dbIdMappings,
  getUniqueId,
  collectionsMapping,
} from "@/utils/appwrite/appwriteConfig";
//context
import { globalContext } from "@/context/GlobalContext";
//react
import { useContext } from "react";

function index({ games, ...props }) {
  const router = useRouter();
  const params = router.query;
  //
  const { dispatch } = useContext(globalContext);

  //handlers
  const handleSharpShooter = (e, game) => {
    if (params.name) {
      dispatch({
        type: "putState",
        payload: {
          gameId: game?.$id,
          gameName: game?.gameName,
          maxLifes: game?.maxLifes,
        },
      });
      const promise = databases.createDocument(
        dbIdMappings.main,
        collectionsMapping.game_session,
        getUniqueId(),
        {
          gameId: game?.$id,
          userName: params?.name,
        }
      );
      promise
        .then((response) => {
          router.push({
            pathname: "/sharp-shooter",
            query: { id: response?.$id },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const handleMemoryMaster = (e) => {};

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <ParticleBg />
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "1rem 2rem",
          border: (theme) =>
            `1px solid ${theme.palette.customTheme.customGrey}`,
          background: "transparent",
        }}
      >
        <Typography
          variant="h4"
          mt={6}
          sx={{ color: "customTheme.text" }}
          align="center"
        >
          Pick Your Game
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "customTheme.text2", mb: 4 }}
          align="center"
        >
          Let's choose the path to your victory
        </Typography>

        <Stack
          direction="row"
          className="select-game"
          sx={{ mt: 8, mb: 10 }}
          spacing={4}
          alignItems="center"
          flex={1}
        >
          {games?.total > 0 ? (
            games?.documents?.map((game, index) => {
              return (
                <ButtonBase
                  onClick={(e) => {
                    handleSharpShooter(e, game);
                  }}
                  key={index}
                >
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{
                      border: (theme) =>
                        `1px solid ${theme.palette.customTheme.customGrey}`,
                      cursor: "pointer",
                      transition: ".3s border ease-in",
                      ":hover": {
                        border: (theme) =>
                          `1px solid ${theme.palette.customTheme.text3}`,
                        "& > .MuiTypography-root": {
                          color: "customTheme.text3",
                        },
                        "& > .MuiSvgIcon-root": {
                          color: "customTheme.text3",
                        },
                      },
                    }}
                    p={4}
                    borderRadius={1}
                  >
                    <CalculateOutlinedIcon
                      sx={{
                        color: "customTheme.text2",
                        transition: ".3s color ease",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "customTheme.text2",
                        transition: ".3s color ease",
                      }}
                    >
                      {game?.gameName}
                    </Typography>
                  </Stack>
                </ButtonBase>
              );
            })
          ) : (
            <Typography>No Games Found</Typography>
          )}

          {/* <ButtonBase onClick={handleMemoryMaster}>
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{
                border: (theme) =>
                  `1px solid ${theme.palette.customTheme.customGrey}`,
                cursor: "pointer",
                transition: ".3s border ease-in",

                ":hover": {
                  border: (theme) =>
                    `1px solid ${theme.palette.customTheme.text3}`,
                  "& > .MuiTypography-root": {
                    color: "customTheme.text3",
                  },
                  "& > .MuiSvgIcon-root": {
                    color: "customTheme.text3",
                  },
                },
              }}
              p={4}
              borderRadius={1}
            >
              <ExtensionOutlinedIcon
                sx={{
                  color: "customTheme.text2",
                  transition: ".3s color ease",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "customTheme.text2",
                  transition: ".3s color ease",
                }}
              >
                Memory Master
              </Typography>
            </Stack>
          </ButtonBase> */}
        </Stack>
        <Typography
          variant="subtitle1"
          sx={{ color: "customTheme.text2", mb: 4 }}
          align="center"
        >
          Join with friends for best multiplayer experience
        </Typography>
      </Paper>
    </Container>
  );
}

export default index;

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
