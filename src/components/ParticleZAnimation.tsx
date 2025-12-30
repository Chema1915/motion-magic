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
    this.size = 1.8;
    this.color = '#D1D5DB';
    this.progress = 0;
    this.delay = Math.random() * 0.2 + relativeY * 0.15; // Shorter delays
    this.speed = 0.008 + Math.random() * 0.006; // Faster speed
  }

  updateCanvasSize(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.targetX = this.relativeTargetX * canvasWidth;
    this.targetY = this.relativeTargetY * canvasHeight;
  }

  update(forming: boolean, time: number, mouse: { x: number; y: number; pressed: boolean }) {
    const mouseRadius = 100; // Radius of mouse influence
    const mouseForce = 15; // How strongly particles are pushed
    
    // Calculate distance from mouse
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Apply mouse repulsion if pressed and within radius - works like sand
    if (mouse.pressed && dist < mouseRadius && dist > 0) {
      const force = (mouseRadius - dist) / mouseRadius * mouseForce;
      this.vx += (dx / dist) * force * 0.3;
      this.vy += (dy / dist) * force * 0.3;
    }
    
    // Apply velocity with friction
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.92; // Friction
    this.vy *= 0.92;
    
    // Bounce off walls
    if (this.x < 0) { this.x = 0; this.vx *= -0.5; }
    if (this.x > this.canvasWidth) { this.x = this.canvasWidth; this.vx *= -0.5; }
    if (this.y < 0) { this.y = 0; this.vy *= -0.5; }
    if (this.y > this.canvasHeight) { this.y = this.canvasHeight; this.vy *= -0.5; }
    
    if (forming) {
      const adjustedTime = Math.max(0, time - this.delay);
      if (adjustedTime > 0) {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 1;
        
        // Gently pull back to target position when not being pushed
        if (!mouse.pressed) {
          const returnForce = 0.03;
          this.vx += (this.targetX - this.x) * returnForce;
          this.vy += (this.targetY - this.y) * returnForce;
        }
      }
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
      
      const zWidth = 0.85; // Wide enough to extend past screen
      const zHeight = 1.0; // Full height from top to bottom
      const offsetX = 0.50; // Visible portion is exactly 50%
      const offsetY = 0; // Start from top
      const thickness = 0.12;
      const spacing = 0.002; // Original spacing for fluid animation
      
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

    // Mouse tracking
    const mouse = { x: 0, y: 0, pressed: false };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseDown = () => {
      mouse.pressed = true;
    };
    
    const handleMouseUp = () => {
      mouse.pressed = false;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (forming) {
        formingTime += 0.016;
      }
      
      particles.forEach(particle => {
        particle.update(forming, formingTime, mouse);
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
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default ParticleZAnimation;
