//mui
import { Paper, Box, Typography, Stack, ButtonBase, Fade } from "@mui/material";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";

//internal components
import ParticleBg from "@components/particlebg";
import Loader from "@components/loader";
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
import { useState } from "react";
import { customToast, getModeId } from "@/utils/utils";
import { getRandomAvatarUrl } from "@/utils/components/pickGame";

function PickGame({ games, ...props }) {
  const router = useRouter();
  const params = router.query;
  const { dispatch } = useContext(globalContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //handlers
  const handleSharpShooter = async (e, game) => {
    if (params.name) {
      const modeId = getModeId();
      if (modeId) {
        dispatch({
          type: "putState",
          payload: {
            gameId: game?.$id,
            gameName: game?.gameName,
            gameType: game?.gameType,
            maxLifes: game?.maxLifes,
          },
        });
        setIsSubmitting(true);
        const avatarUrl = await getRandomAvatarUrl();

        const response = await databases.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.gamers,
          getUniqueId(),
          {
            name: params?.name,
            isAuthenticated: false,
            avatarUrl: avatarUrl,
          }
        );
        const promise = databases.createDocument(
          dbIdMappings.main,
          collectionsMapping.game_session,
          getUniqueId(),
          {
            gameId: game?.$id,
            creatorName: params?.name,
            creatorId: response?.$id,
          }
        );

        promise
          .then((response) => {
            setIsSubmitting(false);
            router.push({
              pathname: "/sharp-shooter",
              query: {
                gsid: response?.$id,
                gid: game?.$id,
                mid: modeId,
              },
            });
          })
          .catch((err) => {
            setIsSubmitting(false);
            customToast(err?.message, "error");
          });
      }
    } else {
      customToast("Mode Id not Found. Please restart the game", "error");
    }
  };

  const handleMemoryMaster = async (e, game) => {
    if (params.name) {
      const modeId = getModeId();
      if (modeId) {
        dispatch({
          type: "putState",
          payload: {
            gameId: game?.$id,
            gameName: game?.gameName,
            gameType: game?.gameType,
            maxLifes: game?.maxLifes,
          },
        });
        setIsSubmitting(true);
        const avatarUrl = await getRandomAvatarUrl();

        const response = await databases.createDocument(
          dbIdMappings?.main,
          collectionsMapping?.gamers,
          getUniqueId(),
          {
            name: params?.name,
            isAuthenticated: false,
            avatarUrl: avatarUrl,
          }
        );
        const promise = databases.createDocument(
          dbIdMappings.main,
          collectionsMapping.game_session,
          getUniqueId(),
          {
            gameId: game?.$id,
            creatorName: params?.name,
            creatorId: response?.$id,
          }
        );

        promise
          .then((response) => {
            setIsSubmitting(false);
            router.push({
              pathname: "/memory-master",
              query: {
                gsid: response?.$id,
                gid: game?.$id,
                mid: modeId,
              },
            });
          })
          .catch((err) => {
            setIsSubmitting(false);
            customToast(err?.message, "error");
          });
      }
    } else {
      customToast("Mode Id not Found. Please restart the game", "error");
    }
  };

  return (
    <Fade in={true}>
      <Box width="100%">
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
            Pick Your Game
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "customTheme.text2", mb: 4 }}
            align="center"
          >
            Let&apos;s choose the path to your victory
          </Typography>
          {isSubmitting ? (
            <Loader disableMessage />
          ) : (
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
                        const sound = new Audio(
                          "/assets/audios/click/button_click.mp3"
                        );
                        sound.play();
                        game?.gameName === "sharp shooter"
                          ? handleSharpShooter(e, game)
                          : handleMemoryMaster(e, game);
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
                          {game?.gameName?.toUpperCase()}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  );
                })
              ) : (
                <Typography>No Games Found</Typography>
              )}
            </Stack>
          )}
          <Typography
            variant="subtitle1"
            sx={{ color: "customTheme.text2", mb: 4 }}
            align="center"
          >
            Join with friends for best multiplayer experience
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
}

export default PickGame;

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
