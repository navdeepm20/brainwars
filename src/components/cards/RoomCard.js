//internal
import ParticlesBg from "@/components/particlebg";

import { Card, CardContent, Stack, Typography, alpha } from "@mui/material";
import StatusIndicator from "@/components/status_indicator";
import PlayerCard from "./PlayerCard";

const GameRoomCard = ({ roomInfo, creatorInfo, gameInfo }) => {
  return (
    <>
      <ParticlesBg />
      <Card
        sx={{
          background: "transparent",
          border: "1px solid #333",
          minWidth: "30rem",
        }}
      >
        <CardContent>
          {/* <Chip1
            fullWidth
            noRadius
            label={`Welcome to ${creatorInfo?.name}'s Room`}
            color="secondary"
            sx={{ fontSize: "2rem" }}
          /> */}
          <Typography
            sx={{
              border: ".1rem solid",
              borderColor: "primary.secondary",
              p: "2rem 3rem",
              backgroundColor: (theme) =>
                alpha(theme.palette.secondary.main, 0.2),

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
          <PlayerCard sx={{ mt: 4 }} />
        </CardContent>
      </Card>
    </>
  );
};

export default GameRoomCard;
