import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 200) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY && !isVisible) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && isVisible) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isVisible]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-light text-foreground">
          Zolve
        </Link>

        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full p-2">
              <path
                d="M20 20 L80 20 L80 25 L30 25 L30 75 L80 75 L80 80 L20 80 L20 75 L70 75 L70 25 L20 25 Z"
                fill="currentColor"
                className="text-primary-foreground"
              />
            </svg>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Catálogo
          </Link>
          <Link to="/nosotros" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Nosotros
          </Link>
          <Link to="/soporte" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Soporte
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
