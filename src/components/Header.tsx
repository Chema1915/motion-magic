import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  const { scrollY } = useScroll();
  
  // Background opacity based on scroll
  const headerBg = useTransform(scrollY, [0, 300], [0, 0.95]);
  
  // Header logo appears only after hero logo fades (synced with hero's logoOpacity)
  const headerLogoOpacity = useTransform(scrollY, [200, 280], [0, 1]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Background layer */}
      <motion.div 
        className="absolute inset-0 bg-background border-b border-border"
        style={{ opacity: headerBg }}
      />
      <motion.div 
        className="absolute inset-0 backdrop-blur-md"
        style={{ opacity: headerBg }}
      />
      
      <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="text-xl font-light text-foreground opacity-0 pointer-events-none">
          Zolve
        </Link>

        {/* Center logo - hidden initially, appears when hero logo fades */}
        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
          <motion.div 
            style={{ opacity: headerLogoOpacity }}
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
