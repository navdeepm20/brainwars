import { useMemo } from "react";
//nextjs
import dynamic from "next/dynamic";
//mui
import { Stack, Typography, alpha } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
//libs
// Dynamically import Avatar component to make it compatible with SSR
const Avatar = dynamic(() => import("react-nice-avatar"), { ssr: false });
import { genConfig } from "react-nice-avatar";

const PlayerCard = ({ name, isCreator, opacity, sx, ...props }) => {
  const config = useMemo(() => genConfig(), []);

  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #333",
        p: "1rem 1.2rem",
        borderRadius: "1rem",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, opacity),
        cursor: "pointer",

        ...sx,
      }}
      direction="row"
      title={isCreator ? "Room Admin" : "Player"}
      {...props}
    >
      <Avatar
        style={{ width: "4rem", height: "4rem", marginRight: "2rem" }}
        {...config}
      />

      <Typography variant="h6">{name}</Typography>
      {isCreator && (
        <StarIcon
          sx={{ fontSize: 16, color: "yellow", ml: "auto", cursor: "pointer" }}
        />
      )}
    </Stack>
  );
};

PlayerCard.defaultProps = {
  opacity: 0.3,
  name: "",
  isCreator: false,
};
export default PlayerCard;
