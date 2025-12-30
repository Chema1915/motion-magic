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
    this.size = 1.2; // Much smaller circles
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
      const thickness = 0.07;
      const spacing = 0.002; // Much denser spacing for tiny circles
      
      // Calculate diagonal angle to make bars same visual width
      const diagAngle = Math.atan2(zHeight - thickness * 2, zWidth);
      const barThickness = thickness * Math.sin(diagAngle); // Adjusted for same visual width
      
      // Z as a single continuous polygon (typography style)
      const zPolygon = [
        { x: offsetX, y: offsetY },
        { x: offsetX + zWidth, y: offsetY },
        { x: offsetX + zWidth, y: offsetY + barThickness },
        { x: offsetX + thickness * 1.2, y: offsetY + zHeight - barThickness },
        { x: offsetX + zWidth, y: offsetY + zHeight - barThickness },
        { x: offsetX + zWidth, y: offsetY + zHeight },
        { x: offsetX, y: offsetY + zHeight },
        { x: offsetX, y: offsetY + zHeight - barThickness },
        { x: offsetX + zWidth - thickness * 1.2, y: offsetY + barThickness },
        { x: offsetX, y: offsetY + barThickness },
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
          if (x <= 1 && isPointInPolygon(x, y, zPolygon)) {
            points.push({ x, y });
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
