import React, { useState, useEffect } from "react";
import Carousel from "../Carousel"; 
import axios from "axios"; 
import galaga from "../../../assets/carousel-galaga.jpg"; 
import pong from "../../../assets/carousel-pong.jpg"; 

const GameOptions = () => {
  const [slides, setSlides] = useState([]);

  const hardcodedPictureUrls = {
    "Galaga": galaga,
    "Pong": pong,
  };

  useEffect(() => {
    fetchSlidesFromAPI(); 
  }, []);

  const fetchSlidesFromAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3001/games/list");
      const formattedSlides = response.data.map(async (slide) => {
        try {
          let imageData;

          if (Object.keys(hardcodedPictureUrls).includes(slide.name)) {
            imageData = hardcodedPictureUrls[slide.name]; 
          } else if (
            slide.picture &&
            slide.picture.type === "Buffer" &&
            slide.picture.data instanceof Array
          ) {
            imageData = await bufferToBase64(slide.picture.data);
          }

          const route = `/play/games/${slide.id}`;

          return {
            ...slide,
            route: route,
            picture: imageData || "", 
          };
        } catch (error) {
          console.error("Erro ao converter dados da imagem:", error);
          return slide;
        }
      });

      const formattedSlidesWithImages = await Promise.all(formattedSlides);
      setSlides(formattedSlidesWithImages);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

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
