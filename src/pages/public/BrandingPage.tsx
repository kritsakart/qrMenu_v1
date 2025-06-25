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
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden branding-page">
      {/* Main Content Container - Responsive design */}
      <div className="relative z-10 w-full max-w-[440px] h-full mx-auto bg-gray-100 flex flex-col main-container">
        
        {/* Cover Photo Section - Responsive height */}
        {location.coverImage && (
          <div className="relative w-full h-[300px] sm:h-[35vh] md:h-[300px] overflow-hidden">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${location.coverImage})`,
                transform: 'scale(1.1)', // Slight zoom for better coverage
                transformOrigin: 'center center'
              }}
            />
            {/* Backdrop blur overlay */}
            <div className="absolute inset-0" style={{ backdropFilter: 'blur(2px)', filter: 'blur(2px)' }} />
          </div>
        )}
        
        {/* Content Container for better organization */}
        <div className="relative flex-1 branding-container">
          {/* Location Info Card - White block with logo - Responsive */}
          <div 
            className="absolute bg-white shadow-lg"
            style={{
              left: '50%',
              top: 'clamp(140px, 20vh, 172px)', // Адаптивне позиціонування
              transform: 'translateX(-50%)',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              width: 'clamp(320px, 88vw, 389px)', // Адаптивна ширина
              height: 'clamp(140px, 19vh, 164px)', // Адаптивна висота
              borderRadius: 'clamp(20px, 4vw, 30px)' // Адаптивні заокруглення
            }}
          >
            {/* Red Logo Circle - Responsive */}
            <div 
              className="absolute bg-[#C80505] rounded-full flex items-center justify-center overflow-hidden"
              style={{
                left: 'clamp(25px, 6vw, 40px)', // Адаптивний відступ зліва
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(70px, 12vw, 100px)', // Адаптивний розмір
                height: 'clamp(70px, 12vw, 100px)'
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
                  className="text-white font-bold"
                  style={{
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    fontSize: 'clamp(14px, 2.5vw, 20px)' // Адаптивний розмір шрифту
                  }}
                >
                  LOGO
                </span>
              )}
            </div>
            
            {/* Text Content - Responsive */}
            <div 
              className="absolute"
              style={{
                left: 'clamp(110px, 22vw, 165px)', // Адаптивний відступ зліва
                top: '50%',
                transform: 'translateY(-50%)',
                right: 'clamp(15px, 4vw, 25px)' // Адаптивний відступ справа
              }}
            >
              {/* Location Name - Responsive */}
              <h2 
                className="text-black font-bold leading-tight"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(20px, 4vw, 31px)', // Адаптивний розмір шрифту
                  marginBottom: 'clamp(0px, 0.2vh, 1px)' // Адаптивний відступ
                }}
              >
                {location.name}
              </h2>
              
              {/* Address - Responsive */}
              <p 
                className="text-black opacity-70"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  fontSize: 'clamp(12px, 2vw, 15px)' // Адаптивний розмір шрифту
                }}
              >
                {location.address || 'address'}
              </p>
            </div>
          </div>

          {/* Promo Section - Responsive */}
          {location.promoImages && location.promoImages.length > 0 && (
            <div 
              className="absolute bg-[#9EED86] shadow-lg overflow-hidden touch-pan-x"
              style={{
                left: '50%',
                top: 'clamp(310px, 43vh, 365px)', // Адаптивне позиціонування
                transform: 'translateX(-50%)',
                width: 'clamp(320px, 88vw, 389px)', // Адаптивна ширина
                height: 'clamp(150px, 22vh, 193px)', // Адаптивна висота
                borderRadius: 'clamp(20px, 4vw, 30px)' // Адаптивні заокруглення
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
                  style={{
                    borderRadius: 'clamp(20px, 4vw, 30px)' // Заокруглення для зображення
                  }}
                />
                
                {/* Navigation Arrows - Responsive */}
                {location.promoImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentSlide((prev) => 
                        prev === 0 ? location.promoImages.length - 1 : prev - 1
                      )}
                      className="absolute top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      style={{
                        left: 'clamp(10px, 2vw, 16px)', // Адаптивна позиція
                        padding: 'clamp(6px, 1.5vw, 8px)' // Адаптивний padding
                      }}
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentSlide((prev) => 
                        (prev + 1) % location.promoImages.length
                      )}
                      className="absolute top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      style={{
                        right: 'clamp(10px, 2vw, 16px)', // Адаптивна позиція
                        padding: 'clamp(6px, 1.5vw, 8px)' // Адаптивний padding
                      }}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Slide Indicators - Responsive */}
          {location.promoImages && location.promoImages.length > 1 && (
            <div 
              className="absolute flex space-x-1"
              style={{
                left: '50%',
                top: 'clamp(475px, 67vh, 570px)', // Адаптивне позиціонування
                transform: 'translateX(-50%)',
                gap: 'clamp(2px, 0.5vw, 4px)' // Адаптивний gap
              }}
            >
              {location.promoImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-colors ${
                    index === currentSlide 
                      ? 'bg-black' 
                      : 'bg-gray-400'
                  }`}
                  style={{
                    width: 'clamp(6px, 1vw, 8px)', // Адаптивний розмір
                    height: 'clamp(6px, 1vw, 8px)'
                  }}
                />
              ))}
            </div>
          )}

          {/* GO TO MENU Button - Responsive */}
          <button
            onClick={handleGoToMenu}
            className="absolute bg-black text-white flex items-center shadow-lg hover:bg-gray-800 transition-colors"
            style={{
              left: '50%',
              top: 'clamp(500px, 70vh, 603px)', // Адаптивне позиціонування
              transform: 'translateX(-50%)',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: 'clamp(16px, 2.5vw, 20.48px)', // Адаптивний розмір шрифту
              fontWeight: 700,
              letterSpacing: '-0.02em',
              width: 'clamp(320px, 88vw, 389px)', // Адаптивна ширина
              height: 'clamp(55px, 8vh, 70px)', // Адаптивна висота
              borderRadius: 'clamp(20px, 4vw, 30px)', // Адаптивні заокруглення
              paddingLeft: 'clamp(35px, 8vw, 52px)', // Адаптивний padding
              paddingRight: 'clamp(25px, 6vw, 35px)'
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
                marginLeft: 'auto',
                width: 'clamp(20px, 4vw, 27px)', // Адаптивний розмір стрілки
                height: 'auto'
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
        </div>

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
          
          /* Покращення адаптивності для різних розмірів екранів */
          @media (max-width: 380px) {
            /* Для дуже маленьких екранів */
            .branding-container {
              padding: 10px;
            }
          }
          
          @media (max-height: 700px) {
            /* Для коротких екранів - зменшуємо відступи */
            .branding-container {
              padding-top: 5px;
            }
          }
          
          @media (max-height: 600px) {
            /* Для дуже коротких екранів - переходимо на flex layout */
            .absolute {
              position: relative !important;
              top: auto !important;
              left: auto !important;
              transform: none !important;
              margin: 10px auto !important;
              display: block !important;
            }
          }
          
          @media (min-width: 441px) {
            /* Для екранів ширших за iPhone Pro Max - центруємо краще */
            .main-container {
              margin: 0 auto;
              max-width: 440px;
            }
          }
          
          /* Покращена адаптивність для планшетів */
          @media (min-width: 768px) {
            .main-container {
              max-width: 480px;
            }
          }
          
          /* Горизонтальна орієнтація */
          @media (orientation: landscape) and (max-height: 500px) {
            .branding-container {
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              padding: 20px;
            }
            
            .absolute {
              position: relative !important;
              top: auto !important;
              left: auto !important;
              transform: none !important;
              margin: 10px !important;
              display: inline-block !important;
              width: auto !important;
              height: auto !important;
            }
          }
          
          /* Екстра маленькі екрани (iPhone SE, старі Android) */
          @media (max-width: 320px) {
            .main-container {
              padding: 5px;
            }
            
            .branding-container .absolute {
              width: calc(100% - 20px) !important;
              left: 10px !important;
              transform: none !important;
            }
          }
          
          /* Дуже широкі екрани (desktop, tablet landscape) */
          @media (min-width: 1024px) {
            .main-container {
              max-width: 500px;
              margin: 0 auto;
            }
          }
          
          /* Висока роздільна здатність */
          @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
            .main-container {
              font-feature-settings: "liga" on, "kern" on;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          }
        `}</style>
      </div>
    </div>
  );
} 