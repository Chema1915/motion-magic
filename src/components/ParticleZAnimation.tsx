import { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  progress: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(targetX: number, targetY: number, canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.targetX = targetX;
    this.targetY = targetY;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = 3;
    this.color = '#D1D5DB';
    this.progress = 0;
  }

  update(forming: boolean) {
    if (forming) {
      this.progress += 0.006;
      if (this.progress > 1) this.progress = 1;
      
      const eased = this.easeInOutCubic(this.progress);
      this.x += (this.targetX - this.x) * eased * 0.05;
      this.y += (this.targetY - this.y) * eased * 0.05;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

const ParticleZAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function createZPoints(canvasWidth: number, canvasHeight: number) {
      const points: { x: number; y: number }[] = [];
      const offsetX = canvasWidth * 0.6;
      const offsetY = canvasHeight * 0.2;
      const zWidth = canvasWidth * 0.5;
      const zHeight = canvasHeight * 0.6;
      const thickness = 40;
      
      // Top bar
      for (let x = 0; x < zWidth; x += 8) {
        for (let y = 0; y < thickness; y += 8) {
          points.push({ x: offsetX + x, y: offsetY + y });
        }
      }
      
      // Diagonal
      const diagonalSteps = 80;
      for (let i = 0; i < diagonalSteps; i++) {
        const progress = i / diagonalSteps;
        const x = zWidth * progress;
        const y = thickness + (zHeight - thickness * 2) * progress;
        
        for (let offset = -thickness/2; offset < thickness/2; offset += 8) {
          points.push({
            x: offsetX + x + offset,
            y: offsetY + y + offset
          });
        }
      }
      
      // Bottom bar
      for (let x = 0; x < zWidth; x += 8) {
        for (let y = 0; y < thickness; y += 8) {
          points.push({
            x: offsetX + x,
            y: offsetY + zHeight - thickness + y
          });
        }
      }
      
      return points;
    }

    const zPoints = createZPoints(canvas.width, canvas.height);
    const particles = zPoints.map(point => new Particle(point.x, point.y, canvas.width, canvas.height));
    
    let forming = false;
    const timeout = setTimeout(() => { forming = true; }, 1000);

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update(forming);
        particle.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

export default ParticleZAnimation;
