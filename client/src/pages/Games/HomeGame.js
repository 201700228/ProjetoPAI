import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Galaga from "../Games/Galaga/Game";
import PongMP from "../Games/Pong/MultiPlayer/Pong"; 
import PongSP from "../Games/Pong/SinglePlayer/Pong"; 
import axios from "axios";
import { toast } from "react-toastify";

const HomeGame = ({ authState }) => {
  const { gameId, gameOptionId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [allGameOptions, setAllGameOptions] = useState([]);

  useEffect(() => {
    const fetchGamesAndOptions = async () => {
      try {
        const [gamesResponse, optionsResponse] = await Promise.all([
          axios.get("http://localhost:3001/games/list"),
          axios.get("http://localhost:3001/game-options/list")
        ]);

        const gamesData = gamesResponse.data;
        const optionsData = optionsResponse.data;

        setGame(gamesData.find(g => g.id === parseInt(gameId)));
        setAllGameOptions(optionsData);
      } catch (error) {
        toast.error("Error fetching game data or game options data from the API", {
          className: "toast-error",
        });
      }
    };

    fetchGamesAndOptions();
  }, [gameId]);

  if (!game) {
    return null;
  }

  const selectedOption = allGameOptions.find(option => option.id === parseInt(gameOptionId));
  const isMultiplayer = selectedOption && selectedOption.name.toLowerCase().includes("multiplayer");

  switch (game.name) {
    case "Galaga":
      return <Galaga authState={authState} />;
    case "Pong":
      return isMultiplayer ? <PongMP authState={authState} /> : <PongSP authState={authState} />;
    default:
      return null;
  }
};

export default HomeGame;
