import { Container } from "@mui/material";

function GlobalLayout({ children, ...props }) {
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
      {children}
    </Container>
  );
}

export default GlobalLayout;
