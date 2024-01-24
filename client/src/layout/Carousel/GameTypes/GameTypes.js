import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../Carousel";
import axios from "axios";
import multiplayer from "../../../assets/carousel-tournament.jpg";
import singleplayer from "../../../assets/carousel-singleplayer.jpg";

const GameTypes = () => {
  const { gameId } = useParams(); 
  const [gameOptions, setGameOptions] = useState([]);

  const hardcodedPictureUrls = {
    "Multiplayer": multiplayer,
    "Singleplayer": singleplayer,
  };

  useEffect(() => {
    const fetchGameOptions = async (gameId) => {
      try {
        const response = await axios.get(`http://localhost:3001/game-options-rel/game/${gameId}`);
        const formattedOptions = response.data.map((optionRel) => {
          console.log(optionRel);
          let imageData;
          if (hardcodedPictureUrls.hasOwnProperty(optionRel.GameOption.name)) {
            imageData = hardcodedPictureUrls[optionRel.GameOption.name];
          }
          return {
            name: optionRel.GameOption.name,
            description: optionRel.GameOption.description,
            picture: imageData || "", 
            route: `/play/games/${gameId}/${optionRel.GameOption.id}`,
          };
        });

        setGameOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching game options:", error);
      }
    };

    fetchGameOptions(gameId);
  }, [gameId]);

  return (
    <div className="home-page">
      <Carousel slides={gameOptions} />
    </div>
  );
};

export default GameTypes;
