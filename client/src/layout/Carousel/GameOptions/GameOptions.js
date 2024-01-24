import React, { useState, useEffect } from "react";
import Carousel from "../Carousel";
import axios from "axios";
import { useLocation } from "react-router-dom";
import galaga from "../../../assets/carousel-galaga.jpg";
import pong from "../../../assets/carousel-pong.jpg";

const GameOptions = () => {
  const location = useLocation();
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
  
          // if (slide.picture && slide.picture.type === "Buffer" && slide.picture.data instanceof Array) {
          //   imageData = await bufferToBase64(slide.picture.data);
          // }

          if (hardcodedPictureUrls.hasOwnProperty(slide.name)) {
            imageData = hardcodedPictureUrls[slide.name];
          }

          const route = `/games/${slide.id}`;
  
          return {
            ...slide,
            route: route,
            picture: imageData || "",
          };
        } catch (error) {
          console.error("Error converting image data:", error);
          return slide;
        }
      });
  
      const formattedSlidesWithImages = await Promise.all(formattedSlides);
      setSlides(formattedSlidesWithImages);
    } catch (error) {
      console.error("Error fetching data from API:", error);
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
