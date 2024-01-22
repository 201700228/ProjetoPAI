import React from "react";
import { useParams } from "react-router-dom";
import Carousel from "../Carousel";
import singlePlayer from "../../../assets/carousel-singleplayer.jpg";
import torneio from "../../../assets/carousel-tournament.jpg";

const GameTypes = () => {
  const { gameOption } = useParams();

  const slides = [
    {
      title: "Single Player",
      subtitle: "",
      image: singlePlayer,
      route: `/play/${gameOption}/single-player`,
    },
    {
      title: "Torneio",
      subtitle: "",
      image: torneio,
      route: `/play/${gameOption}/tournament`,
    },
  ];

  return (
    <div className="home-page">
      <Carousel slides={slides} />
    </div>
  );
};

export default GameTypes;
