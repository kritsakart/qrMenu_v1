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
          <div className="relative w-full overflow-hidden" style={{ height: 'calc(220px + 70px + 50px)' }}>
            <div 
              className="absolute w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${location.coverImage})`,
                transform: 'scale(1.1)', // Slight zoom for better coverage
                transformOrigin: 'center center',
                top: '-140px', // Розширюємо зображення ще більше вгору (70px margin + 70px додатково)
                height: 'calc(100% + 140px)' // Збільшуємо висоту зображення на весь потрібний простір
              }}
            />
            {/* Backdrop blur overlay */}
            <div className="absolute" style={{ 
              backdropFilter: 'blur(2px)', 
              filter: 'blur(2px)',
              top: '-140px', // Також розширюємо blur overlay
              left: '0',
              right: '0',
              height: 'calc(100% + 140px)'
            }} />
          </div>
        )}
        
        {/* Content Container for better organization */}
        <div className="relative flex-1 branding-container">
          {/* Location Info Card - White block with logo - Responsive */}
          <div 
            className="absolute bg-white shadow-lg"
            style={{
              left: '50%',
              top: 'calc(2vh + 10px - 70px - 20px)', // Піднімаю ще на 20 пікселів (загалом 90px)
              transform: 'translateX(-50%)',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              width: 'clamp(280px, 88vw, 349px)', // Адаптивна ширина - зменшено на 40px
              height: 'clamp(120px, 15vh, 135px)', // Зменшено висоту: було 140px,19vh,164px → стало 120px,15vh,135px
              borderRadius: 'clamp(20px, 4vw, 30px)' // Адаптивні заокруглення
            }}
          >
            {/* Red Logo Circle - Responsive */}
            <div 
              className="absolute bg-[#C80505] rounded-full flex items-center justify-center overflow-hidden"
              style={{
                left: 'clamp(15px, 4vw, 25px)', // Зменшено відступ зліва для вузьких екранів
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(60px, 10vw, 85px)', // Зменшено розмір логотипу
                height: 'clamp(60px, 10vw, 85px)'
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
                    fontSize: 'clamp(12px, 2vw, 16px)' // Зменшено розмір шрифту логотипу
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
                left: 'clamp(85px, 16vw, 120px)', // Зменшено відступ зліва для тексту
                top: '50%',
                transform: 'translateY(-50%)',
                right: 'clamp(10px, 3vw, 20px)', // Зменшено відступ справа
                maxWidth: 'calc(100% - clamp(95px, 19vw, 140px))' // Додано максимальну ширину
              }}
            >
              {/* Location Name - Responsive */}
              <h2 
                className="text-black font-bold leading-tight truncate" // Додано truncate для обрізання довгих назв
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(16px, 3.5vw, 28px)', // Зменшено розмір шрифту назви
                  marginBottom: 'clamp(2px, 0.5vh, 4px)', // Збільшено відступ
                  lineHeight: '1.1' // Зменшено висоту рядка
                }}
              >
                {location.name}
              </h2>
              
              {/* Address - Responsive */}
              <p 
                className="text-black opacity-70 truncate" // Додано truncate для обрізання довгих адрес
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  fontSize: 'clamp(10px, 1.8vw, 13px)', // Зменшено розмір шрифту адреси
                  lineHeight: '1.2' // Зменшено висоту рядка
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
                top: 'calc(25vh + 20px - 70px - 20px - 30px - 15px)', // Піднімаю ще на 15 пікселів (загалом 135px)
                transform: 'translateX(-50%)',
                width: 'clamp(280px, 88vw, 349px)', // Адаптивна ширина - зменшено на 40px
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
                top: 'calc(50vh + 30px - 90px - 30px - 25px)', // Піднімаю ще на 25 пікселів (загалом 145px)
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
              top: 'calc(55vh + 35px - 100px - 50px)', // Піднімаю ще на 50 пікселів (загалом 150px)
              transform: 'translateX(-50%)',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: 'clamp(16px, 2.5vw, 20.48px)', // Адаптивний розмір шрифту
              fontWeight: 700,
              letterSpacing: '-0.02em',
              width: 'clamp(280px, 88vw, 349px)', // Адаптивна ширина - зменшено на 40px
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
          
          /* Налаштування для різних розмірів екранів */
          @media (max-width: 380px) {
            /* Для дуже маленьких екранів - Galaxy S9+, iPhone SE */
            .branding-container {
              padding: 5px;
            }
            
            /* Спеціальні налаштування для білого блоку на вузьких екранах */
            .branding-container > div:first-child {
              width: clamp(280px, 88vw, 349px) !important; /* ТАКА Ж ШИРИНА ЯК ПРОМО БЛОК - зменшено на 40px */
              min-width: 260px !important;
              height: auto !important;
              min-height: 100px !important;
              padding: 10px 8px !important;
            }
            
            /* Логотип на вузьких екранах */
            .branding-container > div:first-child > div:first-child {
              width: 50px !important;
              height: 50px !important;
              left: 8px !important;
              flex-shrink: 0;
            }
            
            /* Текст на вузьких екранах */
            .branding-container > div:first-child > div:last-child {
              left: 65px !important;
              right: 8px !important;
              max-width: calc(100% - 73px) !important;
            }
            
            /* Назва локації на вузьких екранах */
            .branding-container > div:first-child h2 {
              font-size: 14px !important;
              line-height: 1.1 !important;
              margin-bottom: 2px !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            /* Адреса на вузьких екранах */
            .branding-container > div:first-child p {
              font-size: 9px !important;
              line-height: 1.1 !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
          }
          
          @media (min-width: 381px) and (max-width: 440px) {
            /* iPhone 12/13/14, Galaxy S21 */
            .branding-container {
              padding: 8px;
            }
          }
          
          @media (max-height: 650px) {
            /* Для коротких екранів - використовуємо менший відступ */
            .branding-container {
              padding-top: 0px;
            }
          }
          
          /* Спрощені стилі для кращої сумісності */
          @media (max-height: 600px) {
            .branding-container {
              padding-top: 0px;
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
            
            /* Білий блок має таку ж ширину як промо блок */
            .branding-container > div:first-child {
              width: clamp(280px, 88vw, 349px) !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
            }
            
            /* Промо блок залишається з тією ж шириною */
            .branding-container > div:nth-child(2) {
              width: clamp(280px, 88vw, 349px) !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
            }
          }
          
          /* Спеціальні налаштування тільки для Galaxy S9+ (320x658) */
          @media (max-width: 320px) and (min-height: 650px) and (max-height: 670px) {
            /* Розширення головного контейнера на всю ширину */
            .main-container {
              max-width: none !important;
              width: 100vw !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Зменшення висоти розмитого фонового блоку на 60px тільки для Galaxy S9+ */
            .main-container > div:first-child {
              height: calc(220px + 70px + 50px - 60px) !important;
              width: 100vw !important;
              left: 0 !important;
              right: 0 !important;
              margin: 0 !important;
            }
            
            /* Розширення фонового зображення на всю ширину екрану без відступів */
            .main-container > div:first-child > div:first-child {
              width: 100vw !important;
              left: 0 !important;
              right: 0 !important;
              transform: scale(1.1) !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            
            /* Розширення blur overlay на всю ширину екрану */
            .main-container > div:first-child > div:last-child {
              width: 100vw !important;
              left: 0 !important;
              right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            
            /* Центрування логотипу в білому блоці + зміщення від лівого краю */
            .branding-container > div:first-child > div:first-child {
              top: 50% !important;
              transform: translateY(-50%) !important;
              left: 33px !important; /* 8px + 25px = 33px від лівого краю */
            }
            
            /* Центрування тексту в білому блоці + зміщення від лівого краю */
            .branding-container > div:first-child > div:last-child {
              top: 50% !important;
              transform: translateY(-50%) !important;
              left: 90px !important; /* 65px + 25px = 90px від лівого краю */
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