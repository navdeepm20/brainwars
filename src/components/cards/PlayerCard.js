import { Stack, Typography, alpha } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
//libs
import Avatar, { genConfig } from "react-nice-avatar";

const config = genConfig({ sex: "man" });
const PlayerCard = ({ name, opacity, isCreator, ...props }) => {
  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #333",
        p: "1rem 1.2rem",
        borderRadius: "1rem",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, opacity),
        ...props?.sx,
      }}
      direction="row"
    >
      <Avatar
        style={{ width: "4rem", height: "4rem", marginRight: "2rem" }}
        {...config}
      />
      <Typography variant="h6">{name}</Typography>
      {isCreator && (
        <StarIcon sx={{ ml: 1, fontSize: 16, color: "yellow", ml: "auto" }} />
      )}
    </Stack>
  );
};

PlayerCard.defaultProps = {
  opacity: 0.3,
  name: "John Doe",
  isCreator: true,
};
export default PlayerCard;
