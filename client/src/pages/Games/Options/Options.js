import React from "https://esm.sh/react@18.2.0";
import Carousel from "../../../layout/Carousel/Carousel";
import galaga from "../../../assets/carousel-galaga.jpg";
import pong from "../../../assets/carousel-pong.jpg";
import { useLocation } from "react-router-dom";

const GameOptions = () => {
  const location = useLocation();

  const slides = [
    {
      title: "Galaga",
      subtitle: "",
      image: galaga,
      route: `${location.pathname}/galaga`,
    },
    {
      title: "Pong",
      subtitle: "",
      image: pong,
      route: `${location.pathname}/pong`,
    },
  ];

  return (
    <div className="home-page">
      <Carousel slides={slides} />
    </div>
  );
};

export default GameOptions;