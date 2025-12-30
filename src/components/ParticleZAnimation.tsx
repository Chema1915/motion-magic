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
  isBackground: boolean; // New: marks if particle stays floating

  constructor(relativeX: number, relativeY: number, canvasWidth: number, canvasHeight: number, isBackground: boolean = false) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.relativeTargetX = relativeX;
    this.relativeTargetY = relativeY;
    this.targetX = relativeX * canvasWidth;
    this.targetY = relativeY * canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * (isBackground ? 0.8 : 1.5);
    this.vy = (Math.random() - 0.5) * (isBackground ? 0.8 : 1.5);
    this.size = isBackground ? 1.2 : 1.8;
    this.color = isBackground ? '#9CA3AF' : '#D1D5DB';
    this.progress = 0;
    this.delay = Math.random() * 0.2 + relativeY * 0.15;
    this.speed = 0.008 + Math.random() * 0.006;
    this.isBackground = isBackground;
  }

  updateCanvasSize(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.targetX = this.relativeTargetX * canvasWidth;
    this.targetY = this.relativeTargetY * canvasHeight;
  }

  update(forming: boolean, time: number, mouse: { x: number; y: number; vx: number; vy: number; pressed: boolean }) {
    // Background particles float randomly but can also be pushed
    if (this.isBackground) {
      const mouseRadius = 25;
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Allow mouse interaction for background particles too
      if (mouse.pressed && dist < mouseRadius) {
        const angle = Math.atan2(mouse.vy, mouse.vx) + (Math.random() - 0.5) * 2.5;
        const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
        const force = (speed * 0.8 + 1.5) * (0.5 + Math.random());
        this.vx = Math.cos(angle) * force + (Math.random() - 0.5) * 2;
        this.vy = Math.sin(angle) * force + (Math.random() - 0.5) * 2;
      }
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Friction for background
      this.vx *= 0.995;
      this.vy *= 0.995;
      
      // Maintain minimum velocity for continuous floating
      if (Math.abs(this.vx) < 0.3) this.vx = (Math.random() - 0.5) * 0.8;
      if (Math.abs(this.vy) < 0.3) this.vy = (Math.random() - 0.5) * 0.8;
      
      // Bounce off walls
      if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
      
      this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
      this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
      return;
    }
    
    const mouseRadius = 25;
    
    // Calculate distance from mouse
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // If mouse is pressed and near particle, fling in mouse direction with chaos
    if (mouse.pressed && dist < mouseRadius) {
      // Gentler movement in denser space
      const angle = Math.atan2(mouse.vy, mouse.vx) + (Math.random() - 0.5) * 2.5;
      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const force = (speed * 0.8 + 1.5) * (0.5 + Math.random());
      
      this.vx = Math.cos(angle) * force + (Math.random() - 0.5) * 2;
      this.vy = Math.sin(angle) * force + (Math.random() - 0.5) * 2;
      this.progress = 0;
    }
    
    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;
    
    // Normal friction
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    // Bounce off walls
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
    
    // Keep within bounds
    this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
    this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
    
    if (forming && !mouse.pressed) {
      const adjustedTime = Math.max(0, time - this.delay);
      if (adjustedTime > 0) {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 1;
        
        const eased = this.easeOutExpo(this.progress);
        const wobble = Math.sin(time * 3 + this.delay * 10) * (1 - this.progress) * 2;
        
        // Move towards target
        this.x += (this.targetX - this.x) * eased * 0.04 + wobble * 0.1;
        this.y += (this.targetY - this.y) * eased * 0.04 + wobble * 0.1;
        
        // Slow down velocity as it forms
        this.vx *= 0.95;
        this.vy *= 0.95;
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
    const zParticles = zRelativePoints.map((point) => 
      new Particle(point.x, point.y, canvas.width, canvas.height, false)
    );
    
    // Create background floating particles
    const backgroundParticleCount = 150;
    const backgroundParticles: Particle[] = [];
    for (let i = 0; i < backgroundParticleCount; i++) {
      backgroundParticles.push(
        new Particle(Math.random(), Math.random(), canvas.width, canvas.height, true)
      );
    }
    
    const particles = [...backgroundParticles, ...zParticles];
    
    let forming = false;
    let formingTime = 0;
    const timeout = setTimeout(() => { forming = true; }, 1000);

    // Mouse tracking with velocity
    const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0, pressed: false };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.vx = mouse.x - mouse.prevX;
      mouse.vy = mouse.y - mouse.prevY;
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      // Don't activate particle interaction when clicking on buttons or links
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], input, textarea')) {
        return;
      }
      e.preventDefault(); // Prevent text selection
      mouse.pressed = true;
    };
    
    const handleMouseUp = () => {
      mouse.pressed = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default ParticleZAnimation;
