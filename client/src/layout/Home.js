import React from "https://esm.sh/react@18.2.0";
import Carousel from "./Carousel/Carousel";
import playGames from "../assets/carousel-play.jpg";
import forum from "../assets/carousel-forum.jpg";

const HomePage = () => {
  const slides = [
    {
      title: "Jogar",
      subtitle: "Single Player e Torneios",
      image: playGames,
      route: "/play",
    },
    {
      title: "Fórum",
      subtitle:
        "Plataforma onde pode discutir sobre jogos, compartilhar experiências e fazer perguntas.",
      image: forum,
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
