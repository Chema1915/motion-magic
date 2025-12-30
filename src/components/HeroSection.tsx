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
      
      <div className="text-center px-6 relative z-10 flex flex-col items-center justify-center">
        {/* Hero Logo - animates up to header, starts below header on all screens */}
        <motion.div 
          style={{ 
            y: logoY,
            scale: logoScale,
            opacity: logoOpacity,
            marginBottom: 'clamp(6px, 2.25vh, 36px)'
          }}
          className="flex flex-col items-center"
        >
          {/* Logo box - fluid responsive sizing based on viewport height */}
          <div 
            className="bg-primary flex items-center justify-center"
            style={{ 
              width: 'clamp(75px, 15vh, 210px)', 
              height: 'clamp(75px, 15vh, 210px)' 
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
            style={{ opacity: textOpacity, marginTop: 'clamp(3px, 0.75vh, 12px)' }}
            className="font-light tracking-tight text-foreground"
          >
            <span style={{ fontSize: 'clamp(1.125rem, 2.7vh, 2.625rem)' }}>Zolve</span>
          </motion.div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-light text-foreground leading-tight"
          style={{ 
            fontSize: 'clamp(2.25rem, 10.5vh, 8.25rem)', 
            marginTop: 'clamp(12px, 3vh, 48px)',
            marginBottom: 'clamp(6px, 2.25vh, 36px)' 
          }}
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
          style={{ 
            fontSize: 'clamp(1.05rem, 2.7vh, 2.1rem)', 
            marginBottom: 'clamp(12px, 3vh, 60px)' 
          }}
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
              padding: 'clamp(9px, 1.8vh, 21px) clamp(18px, 3.75vh, 42px)',
              fontSize: 'clamp(0.9rem, 1.65vh, 1.2rem)'
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
