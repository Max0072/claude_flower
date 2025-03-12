import React, { useState, useEffect, useCallback } from 'react';
import styles from './Carousel.module.scss';

interface CarouselSlide {
  id: string | number;
  image: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  infiniteLoop?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showArrows = true,
  infiniteLoop = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const totalSlides = slides.length;

  const goToSlide = useCallback((index: number) => {
    let slideIndex = index;
    
    if (index < 0) {
      slideIndex = infiniteLoop ? totalSlides - 1 : 0;
    } else if (index >= totalSlides) {
      slideIndex = infiniteLoop ? 0 : totalSlides - 1;
    }
    
    setCurrentSlide(slideIndex);
  }, [totalSlides, infiniteLoop]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAutoPlaying && autoPlay) {
      timer = setInterval(() => {
        nextSlide();
      }, interval);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, autoPlay, interval, nextSlide]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(autoPlay);
  };

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div className={styles.slides}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
          >
            <img src={slide.image} alt={slide.title} className={styles.slideImage} />
            <div className={styles.slideContent}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              {slide.description && (
                <p className={styles.slideDescription}>{slide.description}</p>
              )}
              {slide.buttonText && slide.buttonLink && (
                <a href={slide.buttonLink} className={styles.slideButton}>
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <button 
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      {showIndicators && (
        <div className={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;