import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "../utils/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

//context
import GlobalContextProvider from "@/context/GlobalContext";

const clientSideEmotionCache = createEmotionCache();

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={darkTheme}>
        <main className={inter.className}>
          <GlobalContextProvider>
            <Component {...pageProps} />
          </GlobalContextProvider>
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
}
