import { Container } from "@mui/material";
import React from "react";
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
