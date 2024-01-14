import React, { useState, useRef, useEffect } from "react";
import "./Carousel.css";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slideRef = useRef(null);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  const handleDragStart = (e) => {
    setDragStart(e.clientX);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDragStart(0);
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const dragDistance = e.clientX - dragStart;
      if (dragDistance > 50) {
        prevSlide();
        handleDragEnd();
      } else if (dragDistance < -50) {
        nextSlide();
        handleDragEnd();
      }
    }
  };

  const handleSlideClick = () => {
    const route = slides[currentSlide].route;
    if (route) {
      navigate(route);
    }
  };

  const handleKeyDown = (e) => {
    // Adiciona suporte para navegação com as teclas de setas
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  useEffect(() => {
    // Adiciona um temporizador para avançar automaticamente os slides a cada 5 segundos
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      // Limpa o temporizador ao desmontar o componente
      clearInterval(timer);
    };
  }, [currentSlide]);

  return (
    <div
      className="carousel"
      ref={slideRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDragMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="slide" onBlur={() => slideRef.current.focus()}>
        <div className="slideContent">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            onClick={handleSlideClick}
          />
          <div className="navButton prev" onClick={prevSlide}>
            <FaChevronLeft size={50} />
          </div>
          <div className="navButton next" onClick={nextSlide}>
            <FaChevronRight size={50} />
          </div>
          <div className="slideText">
            <h3>{slides[currentSlide].title}</h3>
            <p>{slides[currentSlide].subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
