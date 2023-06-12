import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "../utils/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

//context
import GlobalContextProvider from "@/context/GlobalContext";
//layouts
import GlobalLayout from "@/components/layouts/GlobalLayout";

const clientSideEmotionCache = createEmotionCache();
//libs
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <GlobalLayout>
              <ToastContainer
                position="top-right"
                autoClose={500000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="glassmorphism-toast"
                bodyClassName="glassmorphism-toast-body"
              />
              <Component {...pageProps} />
            </GlobalLayout>
          </GlobalContextProvider>
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
}
