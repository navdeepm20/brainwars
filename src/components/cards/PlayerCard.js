import React, { useEffect, useMemo, useState } from "react";
//nextjs
import dynamic from "next/dynamic";

//mui
import { Stack, Typography, alpha } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
//libs
// Dynamically import Avatar component to make it compatible with SSR
// const Avatar = dynamic(() => import("react-nice-avatar"), { ssr: false });
// import { genConfig } from "react-nice-avatar";

import SVG from "react-inlinesvg";

const PlayerCard = ({
  name,
  avatarUrl,
  isCreator,
  opacity,
  isWinner,
  score,

  sx,
  ...props
}) => {
  // const config = useMemo(() => genConfig(), []);

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
      {/* <Avatar
        style={{ width: "4rem", height: "4rem", marginRight: "2rem" }}
        {...config}
      /> */}

      <SVG
        src={avatarUrl}
        width={40}
        height={40}
        style={{ marginRight: "1rem" }}
      />

      <Stack direction="row" alignItems="center">
        <Typography variant="h6">{name}</Typography>
        {isCreator && (
          <span title="Room Admin">
            <StarIcon
              sx={{
                fontSize: 16,
                color: "yellow",
                ml: ".5rem",
                mt: ".5rem",
                cursor: "pointer",
              }}
            />
          </span>
        )}

        {isWinner && (
          <span title="Winner">
            <MilitaryTechIcon
              sx={{
                fontSize: 20,
                color: "yellow",
                ml: ".5rem",
                mt: ".7rem",
                cursor: "pointer",
              }}
            />
          </span>
        )}
      </Stack>
      {score !== null && score !== undefined && (
        <Stack direction="row" sx={{ ml: "auto" }}>
          <Typography component="span">
            Score:
            <Typography component="span" sx={{ ml: ".5rem" }}>
              {score !== null && score !== undefined ? score : ""}
            </Typography>
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

PlayerCard.defaultProps = {
  opacity: 0.3,
  name: "",
  isCreator: false,
  avatarUrl: "",
};
export default PlayerCard;
