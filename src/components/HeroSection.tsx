import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleZAnimation from './ParticleZAnimation';
import ZolveLogo from './ZolveLogo';

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const logoOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);
  const logoY = useTransform(scrollYProgress, [0, 0.3], [0, -400]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-secondary relative overflow-hidden">
      <ParticleZAnimation />
      
      <div className="text-center px-6 relative z-10">
        <motion.div 
          style={{ opacity: logoOpacity, scale: logoScale, y: logoY }}
          className="mb-16"
        >
          <ZolveLogo size="large" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-7xl lg:text-8xl font-display font-light mb-8 text-foreground leading-tight"
        >
          Dale valor
          <br />
          a tu tiempo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-16 bg-border"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
