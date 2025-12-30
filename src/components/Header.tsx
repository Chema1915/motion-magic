import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  
  // Logo in header appears when scroll passes the hero threshold
  const headerLogoOpacity = useTransform(scrollY, [150, 250], [0, 1]);
  const headerLogoScale = useTransform(scrollY, [150, 250], [0.5, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header becomes visible after scrolling past hero
      if (currentScrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-light text-foreground">
          Zolve
        </Link>

        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
          <motion.div 
            style={{ opacity: headerLogoOpacity, scale: headerLogoScale }}
            className="w-10 h-10 bg-primary flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full p-2">
              <polygon
                points="15,15 85,15 85,30 40,30 85,70 85,85 15,85 15,70 60,70 15,30"
                fill="currentColor"
                className="text-primary-foreground"
                transform="translate(100 0) scale(-1 1)"
              />
            </svg>
          </motion.div>
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
