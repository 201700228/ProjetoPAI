import React from "https://esm.sh/react@18.2.0";
import Carousel from "./Carousel/Carousel";
import playGames from "../assets/carousel-play.jpg";
import forum from "../assets/carousel-forum.jpg";

const HomePage = () => {
  const slides = [
    {
      name: "Jogar",
      description: "",
      picture: playGames,
      route: "/play",
    },
    {
      name: "Fórum",
      description: "",
      picture: forum,
      route: "/forum",
    },
  ];

  return (
    <div className="home-page">
      <Carousel slides={slides} />
    </div>
  );
};

export default HomePage;
