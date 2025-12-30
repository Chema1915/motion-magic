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
  delay: number;
  speed: number;

  constructor(targetX: number, targetY: number, canvasWidth: number, canvasHeight: number, index: number, total: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.targetX = targetX;
    this.targetY = targetY;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = 2.5;
    this.color = '#D1D5DB';
    this.progress = 0;
    // Staggered delay based on position for wave effect
    this.delay = Math.random() * 0.4 + (targetY / canvasHeight) * 0.3;
    this.speed = 0.003 + Math.random() * 0.004;
  }

  update(forming: boolean, time: number) {
    if (forming) {
      const adjustedTime = Math.max(0, time - this.delay);
      if (adjustedTime > 0) {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 1;
        
        const eased = this.easeOutExpo(this.progress);
        
        // Add subtle organic wobble during movement
        const wobble = Math.sin(time * 3 + this.delay * 10) * (1 - this.progress) * 2;
        
        this.x += (this.targetX - this.x) * eased * 0.04 + wobble * 0.1;
        this.y += (this.targetY - this.y) * eased * 0.04 + wobble * 0.1;
      } else {
        // Still in chaos phase
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
      }
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

  // Smoother, more organic easing
  easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
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
      
      const zWidth = canvasWidth * 0.5;
      const zHeight = canvasHeight * 0.55;
      const offsetX = (canvasWidth - zWidth) / 2;
      const offsetY = (canvasHeight - zHeight) / 2;
      const thickness = 55;
      const spacing = 5;
      
      const zPolygon = [
        { x: offsetX, y: offsetY },
        { x: offsetX + zWidth, y: offsetY },
        { x: offsetX + zWidth, y: offsetY + thickness },
        { x: offsetX + thickness * 1.5, y: offsetY + zHeight - thickness },
        { x: offsetX + zWidth, y: offsetY + zHeight - thickness },
        { x: offsetX + zWidth, y: offsetY + zHeight },
        { x: offsetX, y: offsetY + zHeight },
        { x: offsetX, y: offsetY + zHeight - thickness },
        { x: offsetX + zWidth - thickness * 1.5, y: offsetY + thickness },
        { x: offsetX, y: offsetY + thickness },
      ];
      
      function isPointInPolygon(x: number, y: number, polygon: {x: number, y: number}[]): boolean {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const xi = polygon[i].x, yi = polygon[i].y;
          const xj = polygon[j].x, yj = polygon[j].y;
          
          if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
          }
        }
        return inside;
      }
      
      for (let x = offsetX; x < offsetX + zWidth; x += spacing) {
        for (let y = offsetY; y < offsetY + zHeight; y += spacing) {
          if (isPointInPolygon(x, y, zPolygon)) {
            points.push({ x, y });
          }
        }
      }
      
      return points;
    }

    const zPoints = createZPoints(canvas.width, canvas.height);
    const particles = zPoints.map((point, i) => 
      new Particle(point.x, point.y, canvas.width, canvas.height, i, zPoints.length)
    );
    
    let forming = false;
    let formingTime = 0;
    const timeout = setTimeout(() => { forming = true; }, 1000);

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (forming) {
        formingTime += 0.016; // ~60fps increment
      }
      
      particles.forEach(particle => {
        particle.update(forming, formingTime);
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
