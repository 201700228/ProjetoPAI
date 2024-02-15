import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import Carousel from "../Carousel"; 
import axios from "axios"; 
import multiplayer from "../../../assets/carousel-tournament.jpg"; 
import singleplayer from "../../../assets/carousel-singleplayer.jpg"; 
import leaderboards from "../../../assets/carousel-leaderboard.jpg"; 

// Componente funcional GameTypes
const GameTypes = () => {
  // Obtém o parâmetro gameId da URL
  const { gameId } = useParams();
  // Define um estado para armazenar as opções de jogo
  const [gameOptions, setGameOptions] = useState([]);

  // URLs das imagens hardcoded para os diferentes tipos de jogo
  const hardcodedPictureUrls = {
    "Multiplayer": multiplayer,
    "Singleplayer": singleplayer,
    "Leaderboards": leaderboards,
  };


  useEffect(() => {
    const fetchGameOptions = async (gameId) => {
      try {
        // Faz uma requisição GET para a URL da API para obter as opções de jogo
        const response = await axios.get(`http://localhost:3001/game-options-rel/game/${gameId}`);
        // Formata as opções de jogo obtidas da API
        const formattedOptions = response.data.map((optionRel) => {
          let imageData;
          // Verifica se a URL da imagem da opção de jogo está hardcoded
          if (Object.keys(hardcodedPictureUrls).includes(optionRel.GameOption.name)) {
            imageData = hardcodedPictureUrls[optionRel.GameOption.name]; // Obtém a URL da imagem hardcoded
          }
          // Retorna a opção de jogo formatada
          return {
            name: optionRel.GameOption.name,
            description: optionRel.GameOption.description,
            picture: imageData || "", // Define a imagem da opção de jogo
            route: `/play/games/${gameId}/${optionRel.GameOption.id}`, // Define a rota para a opção de jogo
          };
        });

        // Define as opções de jogo no estado
        setGameOptions(formattedOptions);
      } catch (error) {
        console.error("Erro ao buscar opções de jogo:", error);
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
