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
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.size = 2.5;
    this.color = '#D1D5DB';
    this.progress = 0;
  }

  update(forming: boolean) {
    if (forming) {
      this.progress += 0.008;
      if (this.progress > 1) this.progress = 1;
      
      const eased = this.easeInOutCubic(this.progress);
      this.x += (this.targetX - this.x) * eased * 0.06;
      this.y += (this.targetY - this.y) * eased * 0.06;
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
      
      // Center the Z in the canvas
      const zWidth = canvasWidth * 0.55;
      const zHeight = canvasHeight * 0.6;
      const offsetX = (canvasWidth - zWidth) / 2;
      const offsetY = (canvasHeight - zHeight) / 2;
      const thickness = 65;
      const spacing = 5;
      
      // Top bar
      for (let x = 0; x < zWidth; x += spacing) {
        for (let y = 0; y < thickness; y += spacing) {
          points.push({ x: offsetX + x, y: offsetY + y });
        }
      }
      
      // Diagonal - perpendicular thickness for uniform appearance
      const diagonalLength = Math.sqrt(zWidth * zWidth + (zHeight - thickness * 2) * (zHeight - thickness * 2));
      const angle = Math.atan2(zHeight - thickness * 2, -zWidth);
      const perpAngle = angle + Math.PI / 2;
      
      const diagonalSteps = Math.floor(diagonalLength / spacing);
      for (let i = 0; i <= diagonalSteps; i++) {
        const progress = i / diagonalSteps;
        // Start from right, go to left
        const centerX = offsetX + zWidth - (zWidth * progress);
        const centerY = offsetY + thickness + (zHeight - thickness * 2) * progress;
        
        // Add particles perpendicular to the diagonal
        const halfThickness = thickness / 2;
        for (let t = -halfThickness; t < halfThickness; t += spacing) {
          points.push({
            x: centerX + Math.cos(perpAngle) * t,
            y: centerY + Math.sin(perpAngle) * t
          });
        }
      }
      
      // Bottom bar
      for (let x = 0; x < zWidth; x += spacing) {
        for (let y = 0; y < thickness; y += spacing) {
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
    const timeout = setTimeout(() => { forming = true; }, 800);

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
