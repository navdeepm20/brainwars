//mui
import { Paper, Container, Typography, Stack, ButtonBase } from "@mui/material";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
//internal components
import ParticleBg from "@components/particlebg";

function index({ ...props }) {
  //handlers
  const handleSharpShooter = (e) => {};
  const handleMemoryMaster = (e) => {};
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
          <ButtonBase onClick={handleSharpShooter}>
            <Stack
              justifyContent="center"
              alignItems="center
		  "
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
                Sharp Shooter
              </Typography>
            </Stack>
          </ButtonBase>
          <ButtonBase onClick={handleMemoryMaster}>
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
          </ButtonBase>
        </Stack>
      </Paper>
    </Container>
  );
}

export default index;
