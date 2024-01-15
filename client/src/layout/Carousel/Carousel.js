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
  const [loadedImages, setLoadedImages] = useState([]);

  const handleImageLoad = (index) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, index]);
  };

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

  const handleSlideClick = (index) => {
    const route = slides[index].route;
    if (route) {
      navigate(route);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  useEffect(() => {
    if (slides.length > 3) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [currentSlide, slides, nextSlide]);

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
      <div className="slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "selected" : ""}`}
            onClick={() => handleSlideClick(index)}
          >
            <img
              src={slide.image}
              alt={slide.title}
              onLoad={() => handleImageLoad(index)}
            />
            {loadedImages.includes(index) && (
              <div className="slideText">
                <h3>{slide.title}</h3>
                {/* <p>{slide.subtitle}</p> */}
              </div>
            )}
          </div>
        ))}
      </div>
      {slides.length > 3 && (
        <>
          <div className="navButton prev" onClick={prevSlide}>
            <FaChevronLeft size={50} />
          </div>
          <div className="navButton next" onClick={nextSlide}>
            <FaChevronRight size={50} />
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
