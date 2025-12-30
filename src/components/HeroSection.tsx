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
    <section ref={ref} className="min-h-[100dvh] flex items-center justify-center bg-secondary relative overflow-hidden pt-20">
      <ParticleZAnimation />
      
      <div className="text-center px-6 relative z-10 pt-4 md:pt-8">
        {/* Hero Logo - animates up to header, starts below header on all screens */}
        <motion.div 
          style={{ 
            y: logoY,
            scale: logoScale,
            opacity: logoOpacity,
          }}
          className="mb-[3vh] md:mb-[4vh] flex flex-col items-center"
        >
          {/* Logo box */}
          <div className="w-[10vw] h-[10vw] min-w-[70px] min-h-[70px] max-w-[120px] max-h-[120px] bg-primary flex items-center justify-center">
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
            className="mt-2 font-light tracking-tight text-foreground"
          >
            <span style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}>Zolve</span>
          </motion.div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-light mb-[2vh] md:mb-[3vh] text-foreground leading-tight"
          style={{ fontSize: 'clamp(2rem, 6vw, 6rem)' }}
        >
          Dale valor
          <br />
          a tu tiempo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-[3vh] md:mb-[4vh] font-light"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)' }}
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
            className="inline-block px-8 py-4 border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-wide"
          >
            VER CATÁLOGO
          </Link>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
