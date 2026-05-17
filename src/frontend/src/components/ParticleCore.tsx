import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Orb {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  trailParticles: Particle[];
}

const ORB_COLORS = [
  "rgba(91, 157, 255, 0.9)",
  "rgba(147, 89, 255, 0.9)",
  "rgba(62, 211, 255, 0.9)",
  "rgba(197, 89, 255, 0.85)",
  "rgba(89, 200, 255, 0.85)",
];

export default function ParticleCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;

    const orbs: Orb[] = ORB_COLORS.map((_, i) => ({
      angle: (i / ORB_COLORS.length) * Math.PI * 2,
      radius: 60 + i * 28,
      speed: 0.008 - i * 0.001,
      size: 7 - i * 0.8,
      trailParticles: [],
    }));

    let t = 0;
    const particles: Particle[] = [];

    function spawnParticle(x: number, y: number, color: string) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        size: 1.5 + Math.random() * 2,
        color,
      });
    }

    function drawCore() {
      // Core nucleus
      const coreGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 28);
      coreGrad.addColorStop(0, "rgba(255,255,255,0.95)");
      coreGrad.addColorStop(0.3, "rgba(120,180,255,0.8)");
      coreGrad.addColorStop(0.7, "rgba(100,60,220,0.5)");
      coreGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx!.fillStyle = coreGrad;
      ctx!.fill();

      // Outer glow rings
      for (let i = 0; i < 3; i++) {
        const r = 36 + i * 16 + Math.sin(t * 2 + i) * 4;
        const alpha = 0.3 - i * 0.08;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(100, 160, 255, ${alpha})`;
        ctx!.lineWidth = 1.5 - i * 0.3;
        ctx!.stroke();
      }

      // Equatorial ring
      ctx!.beginPath();
      ctx!.ellipse(
        cx,
        cy,
        100 + Math.sin(t) * 5,
        20,
        Math.PI / 12,
        0,
        Math.PI * 2,
      );
      ctx!.strokeStyle = "rgba(91, 157, 255, 0.35)";
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.ellipse(
        cx,
        cy,
        140 + Math.sin(t + 1) * 6,
        26,
        -Math.PI / 8,
        0,
        Math.PI * 2,
      );
      ctx!.strokeStyle = "rgba(147, 89, 255, 0.25)";
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Background gradient
      const bgGrad = ctx!.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.max(W, H) * 0.7,
      );
      bgGrad.addColorStop(0, "rgba(11, 46, 92, 0.5)");
      bgGrad.addColorStop(0.5, "rgba(30, 15, 60, 0.3)");
      bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, W, H);

      t += 0.012;

      // Drift particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const progress = p.life / p.maxLife;
        const alpha =
          progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx!.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.7})`);
        ctx!.fill();
      }

      drawCore();

      // Orbs
      orbs.forEach((orb, i) => {
        orb.angle += orb.speed;
        const wobble = Math.sin(t * 3 + i) * 8;
        const ox = cx + Math.cos(orb.angle) * (orb.radius + wobble);
        const oy = cy + Math.sin(orb.angle) * (orb.radius * 0.4 + wobble * 0.3);

        // Spawn trail particles
        if (Math.random() < 0.6) spawnParticle(ox, oy, ORB_COLORS[i]);

        // Orb glow
        const glowGrad = ctx!.createRadialGradient(
          ox,
          oy,
          0,
          ox,
          oy,
          orb.size * 4,
        );
        glowGrad.addColorStop(0, ORB_COLORS[i]);
        glowGrad.addColorStop(0.4, ORB_COLORS[i].replace(/[\d.]+\)$/, "0.4)"));
        glowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(ox, oy, orb.size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = glowGrad;
        ctx!.fill();

        // Orb core
        ctx!.beginPath();
        ctx!.arc(ox, oy, orb.size, 0, Math.PI * 2);
        ctx!.fillStyle = ORB_COLORS[i];
        ctx!.fill();
      });

      // Ambient nano-particles at edges
      if (Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const r = 160 + Math.random() * 60;
        spawnParticle(
          cx + Math.cos(angle) * r,
          cy + Math.sin(angle) * r * 0.4,
          "rgba(180, 160, 255, 0.6)",
        );
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      data-ocid="particle-core.canvas_target"
    />
  );
}
