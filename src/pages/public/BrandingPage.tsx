import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePublicMenu } from '@/hooks/usePublicMenu';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrandingPage() {
  const { locationShortId, tableShortId } = useParams();
  const navigate = useNavigate();
  const { location, table, isLoading, error } = usePublicMenu(locationShortId, tableShortId);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Touch events для свайпу
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Додаємо консольний лог для діагностики
  console.log('🖼️ BRANDING PAGE: Location data:', location);
  console.log('🖼️ BRANDING PAGE: Logo image:', location?.logoImage);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!location?.promoImages || location.promoImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % location.promoImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [location?.promoImages]);

  const handleGoToMenu = () => {
    navigate(`/menu/${locationShortId}/${tableShortId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Location not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Main Content Container - iPhone 16 Pro Max dimensions */}
      <div className="relative z-10 w-full max-w-[440px] h-full mx-auto bg-gray-100 flex flex-col">
        
        {/* Cover Photo Section - Only top part */}
        {location.coverImage && (
          <div className="relative w-full h-[300px] overflow-hidden">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${location.coverImage})`,
                transform: 'scale(1.1)', // Slight zoom for better coverage
                transformOrigin: 'center center'
              }}
            />
            {/* Backdrop blur overlay - зменшено до 2px */}
            <div className="absolute inset-0" style={{ backdropFilter: 'blur(2px)' }} />
          </div>
        )}
        
        {/* Location Info Card - White block with logo */}
        <div 
          className="absolute w-[389px] h-[164px] bg-white rounded-[30px] shadow-lg"
          style={{
            left: '50%',
            top: '172px', // Опустив на 50px (було 122px)
            transform: 'translateX(-50%)',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
          }}
        >
          {/* Red Logo Circle */}
          <div 
            className="absolute w-[100px] h-[100px] bg-[#C80505] rounded-full flex items-center justify-center overflow-hidden"
            style={{
              left: '40px', // Зменшено на 5px (було 45px)
              top: '50%', // Центрування по висоті
              transform: 'translateY(-50%)' // Точне центрування по висоті
            }}
          >
            {location.logoImage ? (
              <img
                src={location.logoImage}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span 
                className="text-white text-[20px] font-bold"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}
              >
                LOGO
              </span>
            )}
          </div>
          
          {/* Text Content */}
          <div 
            className="absolute"
            style={{
              left: '165px', // Зменшено на 5px (було 170px)
              top: '50%', // Центрування по висоті
              transform: 'translateY(-50%)', // Точне центрування по висоті
              right: '25px' // Відступ від правого краю
            }}
          >
            {/* Location Name */}
            <h2 
              className="text-black text-[31px] font-bold leading-tight"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '1px' // Зменшено на 5px (було 6px через mb-1)
              }}
            >
              {location.name}
            </h2>
            
            {/* Address */}
            <p 
              className="text-black text-[15px] opacity-70"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                letterSpacing: '-0.01em'
              }}
            >
              {location.address || 'address'}
            </p>
          </div>
        </div>

        {/* Promo Section */}
        {location.promoImages && location.promoImages.length > 0 && (
          <div 
            className="absolute w-[389px] h-[193px] bg-[#9EED86] rounded-[30px] shadow-lg overflow-hidden touch-pan-x"
            style={{
              left: '50%',
              top: '365px', // Центровано між білим блоком (336px кінець) та кнопкою (586px початок)
              transform: 'translateX(-50%)'
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              setTouchStart(touch.clientX);
            }}
            onTouchMove={(e) => {
              if (!touchStart) return;
              const touch = e.touches[0];
              setTouchEnd(touch.clientX);
            }}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd) return;
              const distance = touchStart - touchEnd;
              const isLeftSwipe = distance > 50;
              const isRightSwipe = distance < -50;

              if (isLeftSwipe && location.promoImages) {
                setCurrentSlide((prev) => (prev + 1) % location.promoImages.length);
              }
              if (isRightSwipe && location.promoImages) {
                setCurrentSlide((prev) => prev === 0 ? location.promoImages.length - 1 : prev - 1);
              }
              
              setTouchStart(null);
              setTouchEnd(null);
            }}
          >
            {/* Promo Images Slideshow */}
            <div className="relative w-full h-full">
              <img
                src={location.promoImages[currentSlide]?.url}
                alt={location.promoImages[currentSlide]?.title || 'Promo'}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {location.promoImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((prev) => 
                      prev === 0 ? location.promoImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setCurrentSlide((prev) => 
                      (prev + 1) % location.promoImages.length
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Slide Indicators */}
        {location.promoImages && location.promoImages.length > 1 && (
          <div 
            className="absolute flex space-x-1"
            style={{
              left: '50%',
              top: '570px', // Скориговано для нової позиції кнопки (365px + 193px + 12px)
              transform: 'translateX(-50%)'
            }}
          >
            {location.promoImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-[8px] h-[8px] rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-black' 
                    : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* GO TO MENU Button */}
        <button
          onClick={handleGoToMenu}
          className="absolute w-[389px] h-[70px] bg-black text-white rounded-[30px] flex items-center shadow-lg hover:bg-gray-800 transition-colors"
          style={{
            left: '50%',
            top: '603px', // Опущено ще на 10px (було 593px)
            transform: 'translateX(-50%)',
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '20.48px', // Зменшено ще на 20% (було 25.6px)
            fontWeight: 700,
            letterSpacing: '-0.02em',
            paddingLeft: '52px', // Збільшено на 7px (було 45px)
            paddingRight: '35px' // Відступ стрілки від правого краю (15px + 20px)
          }}
        >
          <span>Go to Menu</span>
          <svg 
            width="27" 
            height="11" 
            viewBox="0 0 27 11" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'arrowSlide 2s ease-in-out infinite',
              marginLeft: 'auto' // Автоматичний відступ зліва
            }}
          >
            <path 
              d="M2 5.5L25 5.5M25 5.5L20 2M25 5.5L20 9" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Animation keyframes */}
        <style>{`
          @keyframes arrowSlide {
            0%, 100% {
              transform: translateX(-3px);
            }
            50% {
              transform: translateX(3px);
            }
          }
        `}</style>
      </div>
    </div>
  );
} 