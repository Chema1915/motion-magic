import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleZAnimation from './ParticleZAnimation';

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  // Logo animation - starts centered, moves up to header position
  // Smoother transition that ends exactly at header position
  const logoY = useTransform(scrollYProgress, [0, 0.3], [0, -320]);
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.25]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  // Logo fades out smoothly at the end of the animation
  const logoOpacity = useTransform(scrollYProgress, [0.25, 0.32], [1, 0]);

  return (
    <section ref={ref} className="h-[100dvh] flex items-center justify-center bg-secondary relative overflow-hidden">
      <ParticleZAnimation />
      
      <div className="text-center px-6 relative z-10 flex flex-col items-center justify-center py-[5vh]">
        {/* Hero Logo - animates up to header, starts below header on all screens */}
        <motion.div 
          style={{ 
            y: logoY,
            scale: logoScale,
            opacity: logoOpacity,
          }}
          className="flex flex-col items-center"
          style-mb="clamp(8px, 2vh, 32px)"
        >
          {/* Logo box - fluid responsive sizing */}
          <div 
            className="bg-primary flex items-center justify-center"
            style={{ 
              width: 'clamp(60px, 12vh, 160px)', 
              height: 'clamp(60px, 12vh, 160px)' 
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full p-3">
              <polygon
                points="15,15 85,15 85,30 40,30 85,70 85,85 15,85 15,70 60,70 15,30"
                fill="currentColor"
                className="text-primary-foreground"
                transform="translate(100 0) scale(-1 1)"
              />
            </svg>
          </div>
          {/* Text - fades out first */}
          <motion.div 
            style={{ opacity: textOpacity }}
            className="font-light tracking-tight text-foreground"
            style-mt="clamp(4px, 1vh, 12px)"
          >
            <span style={{ fontSize: 'clamp(0.875rem, 2vh, 2rem)' }}>Zolve</span>
          </motion.div>
        </motion.div>

        {/* Spacer */}
        <div style={{ height: 'clamp(12px, 3vh, 48px)' }} />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-light text-foreground leading-tight"
          style={{ fontSize: 'clamp(1.75rem, 8vh, 6rem)', marginBottom: 'clamp(8px, 2vh, 32px)' }}
        >
          Dale valor
          <br />
          a tu tiempo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-muted-foreground max-w-2xl mx-auto font-light"
          style={{ fontSize: 'clamp(0.75rem, 2vh, 1.5rem)', marginBottom: 'clamp(12px, 3vh, 48px)' }}
        >
          No vendemos automatizaciones,
          <br />
          te ofrecemos tiempo de vuelta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Link
            to="/catalogo"
            className="inline-block border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-wide"
            style={{ 
              padding: 'clamp(8px, 1.5vh, 16px) clamp(16px, 3vh, 32px)',
              fontSize: 'clamp(0.625rem, 1.2vh, 0.875rem)'
            }}
          >
            VER CATÁLOGO
          </Link>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
