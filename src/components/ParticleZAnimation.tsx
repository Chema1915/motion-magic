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
      
      const zWidth = canvasWidth * 0.5;
      const zHeight = canvasHeight * 0.55;
      const offsetX = (canvasWidth - zWidth) / 2;
      const offsetY = (canvasHeight - zHeight) / 2;
      const thickness = 55;
      const spacing = 5;
      
      // Create a proper Z shape like typography
      // The Z is defined as a polygon with these vertices:
      // Top bar: top-left, top-right, then down to diagonal start
      // Diagonal: goes from top-right area to bottom-left area
      // Bottom bar: bottom-left, bottom-right
      
      // Define the Z polygon vertices (clockwise from top-left)
      const zPolygon = [
        { x: offsetX, y: offsetY },                                           // Top-left outer
        { x: offsetX + zWidth, y: offsetY },                                  // Top-right outer
        { x: offsetX + zWidth, y: offsetY + thickness },                      // Top-right inner (start of diagonal)
        { x: offsetX + thickness * 1.5, y: offsetY + zHeight - thickness },   // Bottom-left diagonal end
        { x: offsetX + zWidth, y: offsetY + zHeight - thickness },            // Bottom-right inner
        { x: offsetX + zWidth, y: offsetY + zHeight },                        // Bottom-right outer
        { x: offsetX, y: offsetY + zHeight },                                 // Bottom-left outer
        { x: offsetX, y: offsetY + zHeight - thickness },                     // Bottom-left inner (start of diagonal)
        { x: offsetX + zWidth - thickness * 1.5, y: offsetY + thickness },    // Top-right diagonal end
        { x: offsetX, y: offsetY + thickness },                               // Top-left inner
      ];
      
      // Fill the polygon with points using a point-in-polygon test
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
      
      // Sample points within the bounding box and keep those inside the polygon
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
