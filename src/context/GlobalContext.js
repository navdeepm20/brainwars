import { createContext, useEffect, useReducer, useState } from "react";

export const globalContext = createContext();
function GlobalContextProvider({ children, ...props }) {
  let initialCurrentGameState = {
    gameId: "",
    gameName: "",
    gameType: "",
    maxLifes: 0,
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
          })
        );
        return {
          gameId: action?.payload?.gameId,
          gameName: action?.payload?.gameName,
          gameType: action?.payload?.gameType,
          maxLifes: action?.payload?.maxLifes,
        };
    }
  };
  const [currentGame, dispatch] = useReducer(reducer, initialCurrentGameState);
  const [user, setUser] = useState({
    name: "",
    id: "",
  });
  const [games, setGames] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("current_game");
    try {
      const parsedData = JSON.parse(data);
      dispatch({ type: "putState", payload: parsedData });
    } catch (err) {
      dispatch({ type: "putState", payload: data });
    }
  }, []);

  return (
    <globalContext.Provider
      value={{ user, setUser, currentGame, dispatch, games, setGames }}
    >
      {children}
    </globalContext.Provider>
  );
}

export default GlobalContextProvider;
