import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Create the light and dark themes
export const lightTheme = createTheme({
  palette: {
    mode: "dark",
    customTheme: {
      text: "#F2F0FF",
      text2: "#B5B3BC",
      text3: "#ffffff",
      text4: "#6d6d6d",
      bg: "#221C3E",
      customGrey: "#333",
    },
  },
  typography: {
    fontSize: 22.4,
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    customTheme: {
      text: "#F2F0FF",
      text2: "#B5B3BC",
      text3: "#ffffff",
      text4: "#6d6d6d",
      bg: "#221C3E",
      customGrey: "#333",
    },
  },
  typography: {
    fontSize: 22.4,
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});
// export const darkTheme = responsiveFontSizes(dTheme, {
//   breakpoints: ["xs", "sm", "md", "lg", "xl"],
//   factor: 2,
// });
