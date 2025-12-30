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
  relativeTargetX: number;
  relativeTargetY: number;

  constructor(relativeX: number, relativeY: number, canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.relativeTargetX = relativeX;
    this.relativeTargetY = relativeY;
    this.targetX = relativeX * canvasWidth;
    this.targetY = relativeY * canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = 2;
    this.color = '#D1D5DB';
    this.progress = 0;
    this.delay = Math.random() * 0.5 + relativeY * 0.3;
    this.speed = 0.003 + Math.random() * 0.004;
  }

  updateCanvasSize(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.targetX = this.relativeTargetX * canvasWidth;
    this.targetY = this.relativeTargetY * canvasHeight;
  }

  update(forming: boolean, time: number) {
    if (forming) {
      const adjustedTime = Math.max(0, time - this.delay);
      if (adjustedTime > 0) {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 1;
        
        const eased = this.easeOutExpo(this.progress);
        const wobble = Math.sin(time * 3 + this.delay * 10) * (1 - this.progress) * 2;
        
        this.x += (this.targetX - this.x) * eased * 0.04 + wobble * 0.1;
        this.y += (this.targetY - this.y) * eased * 0.04 + wobble * 0.1;
      } else {
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

    function createZRelativePoints() {
      const points: { x: number; y: number }[] = [];
      
      const zWidth = 0.7;
      const zHeight = 0.85;
      const offsetX = 0.45;
      const offsetY = (1 - zHeight) / 2;
      const thickness = 0.07; // Uniform thickness for all bars
      const spacing = 0.0035;
      
      // Top bar - horizontal rectangle
      for (let x = offsetX; x <= Math.min(1, offsetX + zWidth); x += spacing) {
        for (let y = offsetY; y <= offsetY + thickness; y += spacing) {
          points.push({ x, y });
        }
      }
      
      // Bottom bar - horizontal rectangle
      for (let x = offsetX; x <= Math.min(1, offsetX + zWidth); x += spacing) {
        for (let y = offsetY + zHeight - thickness; y <= offsetY + zHeight; y += spacing) {
          points.push({ x, y });
        }
      }
      
      // Diagonal - with perpendicular thickness for uniform width
      const diagStartX = offsetX + zWidth;
      const diagStartY = offsetY + thickness;
      const diagEndX = offsetX;
      const diagEndY = offsetY + zHeight - thickness;
      
      const diagLength = Math.sqrt(
        Math.pow(diagEndX - diagStartX, 2) + Math.pow(diagEndY - diagStartY, 2)
      );
      const diagAngle = Math.atan2(diagEndY - diagStartY, diagEndX - diagStartX);
      const perpAngle = diagAngle + Math.PI / 2;
      
      const steps = Math.floor(diagLength / spacing);
      const halfThickness = thickness / 2;
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const centerX = diagStartX + (diagEndX - diagStartX) * t;
        const centerY = diagStartY + (diagEndY - diagStartY) * t;
        
        // Add points perpendicular to the diagonal
        const perpSteps = Math.floor(thickness / spacing);
        for (let j = 0; j <= perpSteps; j++) {
          const offset = -halfThickness + (j / perpSteps) * thickness;
          const px = centerX + Math.cos(perpAngle) * offset;
          const py = centerY + Math.sin(perpAngle) * offset;
          
          if (px <= 1 && px >= 0 && py >= 0 && py <= 1) {
            points.push({ x: px, y: py });
          }
        }
      }
      
      return points;
    }

    const zRelativePoints = createZRelativePoints();
    const particles = zRelativePoints.map((point) => 
      new Particle(point.x, point.y, canvas.width, canvas.height)
    );
    
    let forming = false;
    let formingTime = 0;
    const timeout = setTimeout(() => { forming = true; }, 1000);

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (forming) {
        formingTime += 0.016;
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
      
      particles.forEach(particle => {
        particle.updateCanvasSize(canvas.width, canvas.height);
      });
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
