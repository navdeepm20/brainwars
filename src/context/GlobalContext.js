import { createContext, useEffect, useReducer, useState } from "react";

export const globalContext = createContext();
function GlobalContextProvider({ children, ...props }) {
  let initialCurrentGameState = {
    gameId: "",
    gameName: "",
    gameType: "",
    maxLifes: 0,
    extra: {},
  };

  //for current game
  const reducer = (state, action) => {
    switch (action?.type) {
      case "updateLife":
        localStorage.setItem(
          "current_game",
          JSON.stringify({ ...state, age: action?.payload?.age })
        );
        return { ...state, age: action?.payload?.age };
      case "putState":
        localStorage.setItem(
          "current_game",
          JSON.stringify({
            gameId: action?.payload?.gameId,
            gameName: action?.payload?.gameName,
            gameType: action?.payload?.gameType,
            maxLifes: action?.payload?.maxLifes,
            extra: action?.payload?.extra || {},
          })
        );
        return {
          gameId: action?.payload?.gameId,
          gameName: action?.payload?.gameName,
          gameType: action?.payload?.gameType,
          maxLifes: action?.payload?.maxLifes,
          extra: action?.payload?.extra || {},
        };
    }
  };
  const [currentGame, dispatch] = useReducer(reducer, initialCurrentGameState);
  const [user, setUser] = useState({
    name: "",
    id: "",
  });

  const [metaInfo, setMetaInfo] = useState({
    gameMode: "",
    gameModeId: "",
    isGameStarted: false,
  });

  const [games, setGames] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("current_game");
    const userInfo = JSON.parse(localStorage.getItem("user")) || {
      id: "",
      name: "",
    };
    if (userInfo?.name?.trim("") !== "") setUser(userInfo);
    try {
      const parsedData = JSON.parse(data);
      dispatch({ type: "putState", payload: parsedData });
    } catch (err) {
      dispatch({ type: "putState", payload: data });
    }
  }, []);

  return (
    <globalContext.Provider
      value={{
        user,
        setUser,
        currentGame,
        dispatch,
        games,
        setGames,
        metaInfo,
        setMetaInfo,
      }}
    >
      {children}
    </globalContext.Provider>
  );
}

export default GlobalContextProvider;
