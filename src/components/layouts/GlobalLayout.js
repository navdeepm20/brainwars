//mui
import { Container } from "@mui/material";
//react

function GlobalLayout({ children, ...props }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        my: "4rem",
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
