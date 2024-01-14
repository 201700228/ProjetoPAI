import React from "react";
import { useParams } from "react-router-dom";
import Carousel from "../../../layout/Carousel/Carousel";
import singlePlayer from "../../../assets/carousel-singleplayer.jpg";
import torneio from "../../../assets/carousel-tournament.jpg";

const GameTypes = () => {
  const { gameType } = useParams();

  const slides = [
    {
      title: "Single Player",
      subtitle: "",
      image: singlePlayer,
      route: `/play/${gameType}/single-player`,
    },
    {
      title: "Torneio",
      subtitle: "",
      image: torneio,
      route: `/play/${gameType}/tournament`,
    },
  ];

  return (
    <div className="home-page">
      <Carousel slides={slides} />
    </div>
  );
};

export default GameTypes;
