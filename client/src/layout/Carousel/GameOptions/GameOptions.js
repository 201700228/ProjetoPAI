import React, { useState, useEffect } from "react";
import Carousel from "../Carousel"; 
import axios from "axios"; 
import galaga from "../../../assets/carousel-galaga.jpg"; 
import pong from "../../../assets/carousel-pong.jpg"; 

const GameOptions = () => {
  const [slides, setSlides] = useState([]);

  // URLs das imagens hardcoded para alguns jogos
  const hardcodedPictureUrls = {
    "Galaga": galaga,
    "Pong": pong,
  };

  useEffect(() => {
    fetchSlidesFromAPI(); // Chama a função para buscar os slides da API
  }, []);

  // Função assíncrona para obter os slides da API
  const fetchSlidesFromAPI = async () => {
    try {
      // Faz um pedido GET para a URL da API
      const response = await axios.get("http://localhost:3001/games/list");
      // Formata os slides obtidos da API
      const formattedSlides = response.data.map(async (slide) => {
        try {
          let imageData;

          // Verifica se a URL da imagem do slide está hardcoded
          if (Object.keys(hardcodedPictureUrls).includes(slide.name)) {
            imageData = hardcodedPictureUrls[slide.name]; // Obtém a URL da imagem hardcoded
          } else if (
            slide.picture &&
            slide.picture.type === "Buffer" &&
            slide.picture.data instanceof Array
          ) {
            // Converte os dados da imagem para Base64
            imageData = await bufferToBase64(slide.picture.data);
          }

          // Define a rota para o slide
          const route = `/play/games/${slide.id}`;

          // Retorna o slide formatado
          return {
            ...slide,
            route: route,
            picture: imageData || "", // Define a imagem do slide
          };
        } catch (error) {
          console.error("Erro ao converter dados da imagem:", error);
          return slide;
        }
      });

      // Aguarda a resolução de todas as promises dos slides formatados
      const formattedSlidesWithImages = await Promise.all(formattedSlides);
      // Define os slides no estado
      setSlides(formattedSlidesWithImages);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  // Função para converter buffer de imagem para Base64
  const bufferToBase64 = (buffer) => {
    return new Promise((resolve, reject) => {
      const blob = new Blob([new Uint8Array(buffer)], { type: "image/jpeg" });
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="home-page">
      <Carousel slides={slides} />
    </div>
  );
};

export default GameOptions;
