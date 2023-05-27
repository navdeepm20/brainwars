//mui
import {
  Paper,
  Container,
  Typography,
  Stack,
  TextField,
  InputLabel,
  Button,
} from "@mui/material";
//internal components
import ParticleBg from "@components/particlebg";

function index({ ...props }) {
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
          border: "1px solid #333",
          background: "transparent",
        }}
      >
        <Typography
          variant="h4"
          mt={6}
          sx={{ color: "customTheme.text" }}
          align="center"
        >
          Welcome to MathWars
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "customTheme.text2", mb: 4 }}
          align="center"
        >
          Let's start the Fun
        </Typography>

        <InputLabel sx={{ mr: "auto", mb: 1 }}>Enter You Name</InputLabel>
        <TextField id="name" fullWidth sx={{ mb: 2 }} />

        <Button variant="contained" fullWidth color="success">
          Start Game
        </Button>
        <Stack className="join-create" sx={{ mt: 8 }} alignItems="center">
          <Typography sx={{ color: "customTheme.text", mb: 4 }} align="center">
            Let's have more fun with multiplayer battles
          </Typography>
          <Stack direction="row" spacing={3}>
            <Button variant="outlined" color="primary">
              Create Room
            </Button>
            <Button variant="outlined" color="secondary">
              Join Room
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default index;
