import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Galaga from "../Games/Galaga/Game";
import Pong from "../Games/Pong/Pong"; 
import axios from "axios";
import { toast } from "react-toastify";

const HomeGame = ({authState}) => {
  const { gameId, gameOptionId } = useParams();
  const navigate = useNavigate();
  const [gameName, setGameName] = useState(null);
  const [games, setGames] = useState([]);
  const [allGameOptions, setAllGameOptions] = useState([]);

  useEffect(() => {
    const fetchGamesAndOptions = async () => {
      try {
        const [gamesResponse, optionsResponse] = await Promise.all([
          axios.get("http://localhost:3001/games/list"),
          axios.get("http://localhost:3001/game-options/list")
        ]);

        setGames(gamesResponse.data);
        setAllGameOptions(optionsResponse.data);
      } catch (error) {
        toast.error("Error fetching game data or game options data from the API", {
          className: "toast-error",
        });
      }
    };

    fetchGamesAndOptions();
  }, []);

  useEffect(() => {
    const mappedGameName = games.length > 0 && games.find(game => game.id === parseInt(gameId))?.name;
    const gameOption = allGameOptions.length > 0 && allGameOptions.find(option => option.id === parseInt(gameOptionId))?.name;

    if (mappedGameName && gameOption) {
      setGameName(mappedGameName);
    } 
  }, [gameId, gameOptionId, navigate, games, allGameOptions]);

  switch (gameName) {
    case "Galaga":
      return <Galaga authState={authState}/>;
    case "Pong":
      return <Pong authState={authState} />;
    default:
      return null; 
  }
};

export default HomeGame;
