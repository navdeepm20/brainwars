import React, { useState, useEffect } from "react";
import { Appwrite } from "appwrite";
import { databases } from "@/utils/appwrite/appwriteConfig.js";

function index() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    checkGameOver();
  }, [board]);

  const handleCellClick = async (index) => {
    if (board[index] === "" && !gameOver) {
      const updatedBoard = [...board];
      updatedBoard[index] = player;
      setBoard(updatedBoard);
      setPlayer(player === "X" ? "O" : "X");

      await updateAppwriteGame(updatedBoard);
    }
  };

  const checkGameOver = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameOver(true);
        return;
      }
    }

    if (!board.includes("")) {
      setGameOver(true);
    }
  };

  const updateAppwriteGame = async (board) => {
    try {
      await databases.updateDocument("YOUR_COLLECTION_ID", "YOUR_DOCUMENT_ID", {
        board,
      });
    } catch (error) {
      console.error("Failed to update game in Appwrite", error);
    }
  };

  const resetGame = async () => {
    setBoard(Array(9).fill(""));
    setPlayer("X");
    setGameOver(false);

    try {
      await client.database.updateDocument(
        "YOUR_COLLECTION_ID",
        "YOUR_DOCUMENT_ID",
        { board: Array(9).fill("") }
      );
    } catch (error) {
      console.error("Failed to reset game in Appwrite", error);
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await databases.getDocument(
          "YOUR_COLLECTION_ID",
          "YOUR_DOCUMENT_ID"
        );
        if (response?.data?.board) {
          setBoard(response.data.board);
        }
      } catch (error) {
        console.error("Failed to fetch game from Appwrite", error);
      }
    };

    fetchGame();
  }, []);

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default index;
