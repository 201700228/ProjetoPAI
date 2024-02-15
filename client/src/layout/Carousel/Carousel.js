import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Carousel.css"; 
import { useNavigate } from "react-router-dom"; 
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 

const Carousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);
  const navigate = useNavigate();
  
  const prevSlide = () => {
    if (slides.length > 2) {
      setCurrentSlide((prevSlide) =>
        prevSlide > 0 ? prevSlide - 1 : slides.length - 3
      );
    }
  };
  
  const nextSlide = useCallback(() => {
    if (slides.length > 2) {
      setCurrentSlide((prevSlide) =>
        prevSlide < slides.length - 3 ? prevSlide + 1 : 0
      );
    }
  }, [setCurrentSlide, slides.length]);
  
  const handleSlideClick = (index) => {
    const route = slides[index]?.route;
    if (route) {
      navigate(route); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" && slides.length > 2) {
      prevSlide();
    } else if (
      e.key === "ArrowRight" &&
      slides.length > 2
    ) {
      nextSlide();
    }
  };

  useEffect(() => {
    if (slides.length > 2) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => {
        clearInterval(timer); 
      };
    }
  }, [currentSlide, slides.length, nextSlide]);

  return (
    <div
      className="carousel"
      ref={slideRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="slides-container">
        {slides.length > 2 && (
          <div
            className="slides"
            style={{
              transform: `translateX(-${(100 / Math.min(3, slides.length)) *
                currentSlide}%)`,
              width: `${(100 / Math.min(3, slides.length)) * slides.length}%`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? "selected" : ""}`}
                onClick={() => handleSlideClick(index)}
              >
                {slide.picture ? (
                  <img
                    src={slide.picture}
                    alt={slide.name}
                    loading="eager"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "black",
                    }}
                  ></div>
                )}
                <div className="slideText">
                  <h3>{slide.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {slides.length <= 2 && (
          <div
            className="slides"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? "selected" : ""}`}
                onClick={() => handleSlideClick(index)}
              >
                {slide.picture ? (
                  <img
                    src={slide.picture}
                    alt={slide.name}
                    loading="eager"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "black",
                    }}
                  ></div>
                )}
                <div className="slideText">
                  <h3>{slide.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {slides.length > 3 && (
        <>
          {currentSlide > 0 && (
            <FaChevronLeft className="navButton prev" onClick={prevSlide} />
          )}
          {currentSlide < slides.length - 1 && (
            <FaChevronRight className="navButton next" onClick={nextSlide} />
          )}
        </>
      )}
    </div>
  );
};

export default Carousel;
