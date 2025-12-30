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
    <section ref={ref} className="h-[100dvh] flex items-center justify-center bg-secondary relative overflow-hidden xl:pt-20">
      <ParticleZAnimation />
      
      <div className="text-center px-6 relative z-10 flex flex-col items-center justify-center">
        {/* Hero Logo - animates up to header, starts below header on all screens */}
        <motion.div 
          style={{ 
            y: logoY,
            scale: logoScale,
            opacity: logoOpacity,
          }}
          className="mb-[2vh] md:mb-[3vh] xl:mb-16 flex flex-col items-center"
        >
          {/* Logo box - responsive sizing */}
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 2xl:w-40 2xl:h-40 bg-primary flex items-center justify-center">
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
            className="mt-1 md:mt-2 xl:mt-3 font-light tracking-tight text-foreground"
          >
            <span className="text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">Zolve</span>
          </motion.div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-light mb-[1.5vh] md:mb-[2vh] xl:mb-8 text-foreground leading-tight text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
        >
          Dale valor
          <br />
          a tu tiempo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-[2vh] md:mb-[3vh] xl:mb-12 font-light text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
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
            className="inline-block px-6 py-3 xl:px-8 xl:py-4 border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-xs md:text-sm tracking-wide"
          >
            VER CATÁLOGO
          </Link>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
