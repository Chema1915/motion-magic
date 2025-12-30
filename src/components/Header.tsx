import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  const { scrollY } = useScroll();
  
  // Background opacity based on scroll
  const headerBg = useTransform(scrollY, [0, 300], [0, 0.95]);
  
  // Header logo appears exactly when hero logo fades - smooth crossfade
  const headerLogoOpacity = useTransform(scrollY, [220, 300], [0, 1]);

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
      
      <div className="w-full px-6 py-4 flex items-center relative z-10">
        {/* Left spacer (keeps layout stable; logo is absolutely centered) */}
        <div className="flex-1" aria-hidden="true" />

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

        <nav className="ml-auto flex items-center" style={{ gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
          <Link 
            to="/catalogo" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.25rem)' }}
          >
            Catálogo
          </Link>
          <Link 
            to="/nosotros" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.25rem)' }}
          >
            Nosotros
          </Link>
          <Link 
            to="/soporte" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.25rem)' }}
          >
            Soporte
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
