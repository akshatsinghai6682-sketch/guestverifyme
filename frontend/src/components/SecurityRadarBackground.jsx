import React, { useEffect, useRef } from 'react';

/**
 * SecurityRadarBackground
 * 60 FPS Canvas background simulating an active autonomous AI perimeter surveillance grid:
 * - Rotating radar sweep with biometric detection blips
 * - Concentric perimeter sonar rings (10m, 25m, 50m defense zones)
 * - Encrypted sensor mesh telemetry nodes with connecting laser lines
 * - Optical laser scan sweep traversing the residence perimeter
 * - Theme adaptive (Dark Mode: Cyber Obsidian & Emerald/Cyan; Light Mode: Orchid Royal Blue & Sky)
 */
export function SecurityRadarBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    // Handle high-DPI displays (Retina)
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const isLight = theme === 'light';

    // Radar configuration
    let radarAngle = 0;
    const radarSpeed = 0.007;

    // Optical laser scan line traversing vertically
    let scanLineY = 0;
    const scanLineSpeed = 1.2;

    // Concentric sonar pulse rings
    const sonarRings = [
      { radius: 40, maxRadius: 380, speed: 0.8, opacity: 0.6 },
      { radius: 160, maxRadius: 380, speed: 0.8, opacity: 0.4 },
      { radius: 280, maxRadius: 380, speed: 0.8, opacity: 0.2 },
    ];

    // Detection targets (blips) around the radar origin
    const targets = [
      { angle: 0.8, dist: 130, label: 'CAM_01 [FRONT_GATE]', pulse: 0, type: 'authorized' },
      { angle: 2.1, dist: 210, label: 'DEL_001 [AMAZON_LOCK]', pulse: 0, type: 'delivery' },
      { angle: 3.6, dist: 175, label: 'LIDAR [PERIMETER_NORTH]', pulse: 0, type: 'sensor' },
      { angle: 4.9, dist: 260, label: 'OPTICAL [AUDIO_BEAM]', pulse: 0, type: 'sensor' },
      { angle: 5.7, dist: 110, label: 'DOOR_STRIKE [ARMED]', pulse: 0, type: 'lock' },
    ];

    // Floating telemetry network particles
    const particleCount = Math.min(Math.floor(width / 45), 36);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Radar origin point (centered near the top header, like an overhead residence mast sensor)
      const radarX = width * 0.5;
      const radarY = 120;
      const radarMaxRadius = Math.min(width * 0.45, 360);

      // --- 1. CONCENTRIC SONAR PERIMETER RINGS ---
      sonarRings.forEach((ring) => {
        ring.radius += ring.speed;
        if (ring.radius > ring.maxRadius) {
          ring.radius = 20;
        }

        const ringProgress = ring.radius / ring.maxRadius;
        const ringAlpha = (1 - ringProgress) * (isLight ? 0.25 : 0.22);

        ctx.beginPath();
        ctx.arc(radarX, radarY, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isLight
          ? `rgba(59, 130, 246, ${ringAlpha})`
          : `rgba(16, 185, 129, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Fixed distance boundary arcs (10m, 25m, 40m zones)
      [0.35, 0.7, 1.0].forEach((fraction, idx) => {
        const r = radarMaxRadius * fraction;
        ctx.beginPath();
        ctx.arc(radarX, radarY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isLight
          ? 'rgba(99, 102, 241, 0.07)'
          : 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Zone label
        ctx.font = '9px monospace';
        ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.45)' : 'rgba(148, 163, 184, 0.35)';
        ctx.fillText(`ZONE 0${idx + 1} // ${Math.round(fraction * 50)}M`, radarX + r + 6, radarY + 3);
      });

      // Crosshair axis lines through radar
      ctx.beginPath();
      ctx.moveTo(radarX - radarMaxRadius - 20, radarY);
      ctx.lineTo(radarX + radarMaxRadius + 20, radarY);
      ctx.moveTo(radarX, radarY - radarMaxRadius - 10);
      ctx.lineTo(radarX, radarY + radarMaxRadius + 20);
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- 2. ROTATING RADAR SWEEP BEAM ---
      radarAngle = (radarAngle + radarSpeed) % (Math.PI * 2);

      // Trailing radar sweep wedge
      const sweepAngleSpan = 0.55;
      const gradient = ctx.createRadialGradient(radarX, radarY, 0, radarX, radarY, radarMaxRadius);
      if (isLight) {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.14)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(radarX, radarY);
      ctx.arc(radarX, radarY, radarMaxRadius, radarAngle - sweepAngleSpan, radarAngle, false);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Leading sharp laser sweep ray
      ctx.beginPath();
      ctx.moveTo(radarX, radarY);
      ctx.lineTo(
        radarX + Math.cos(radarAngle) * radarMaxRadius,
        radarY + Math.sin(radarAngle) * radarMaxRadius
      );
      ctx.strokeStyle = isLight
        ? 'rgba(59, 130, 246, 0.65)'
        : 'rgba(52, 211, 153, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // --- 3. TARGET BLIPS & LABELS ---
      targets.forEach((target) => {
        const tx = radarX + Math.cos(target.angle) * target.dist;
        const ty = radarY + Math.sin(target.angle) * target.dist;

        // Check if radar sweep just passed over this target
        const angleDiff = (radarAngle - target.angle + Math.PI * 2) % (Math.PI * 2);
        if (angleDiff < 0.15) {
          target.pulse = 1.0;
        } else {
          target.pulse = Math.max(0, target.pulse - 0.015);
        }

        const baseAlpha = isLight ? 0.35 : 0.3;
        const currentAlpha = Math.min(1, baseAlpha + target.pulse * 0.7);

        // Blip dot
        ctx.beginPath();
        ctx.arc(tx, ty, target.pulse > 0 ? 3.5 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(59, 130, 246, ${currentAlpha})`
          : `rgba(52, 211, 153, ${currentAlpha})`;
        ctx.fill();

        // Expanding ping ring on radar contact
        if (target.pulse > 0.1) {
          ctx.beginPath();
          ctx.arc(tx, ty, 6 + (1 - target.pulse) * 16, 0, Math.PI * 2);
          ctx.strokeStyle = isLight
            ? `rgba(59, 130, 246, ${target.pulse * 0.6})`
            : `rgba(52, 211, 153, ${target.pulse * 0.7})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Target HUD callout label
        if (target.pulse > 0.05 || frame % 120 < 80) {
          ctx.font = '8px monospace';
          ctx.fillStyle = isLight
            ? `rgba(30, 41, 59, ${currentAlpha * 0.85})`
            : `rgba(203, 213, 225, ${currentAlpha * 0.75})`;
          ctx.fillText(target.label, tx + 7, ty - 4);
        }
      });

      // --- 4. FLOATING TELEMETRY MESH PARTICLES & CONNECTING LASERS ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulse particle
        const pulse = Math.sin(frame * p.pulseSpeed) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(99, 102, 241, ${p.alpha * pulse * 0.55})`
          : `rgba(6, 182, 212, ${p.alpha * pulse * 0.65})`;
        ctx.fill();

        // Connect nearby particles with subtle laser lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isLight ? 0.12 : 0.15);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight
              ? `rgba(99, 102, 241, ${lineAlpha})`
              : `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // --- 5. VERTICAL OPTICAL SCAN LASER SWEEP ---
      scanLineY += scanLineSpeed;
      if (scanLineY > height + 80) {
        scanLineY = -80;
      }

      if (scanLineY >= 0 && scanLineY <= height) {
        // Gradient trailing beam above scan line
        const scanGrad = ctx.createLinearGradient(0, scanLineY - 35, 0, scanLineY);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        scanGrad.addColorStop(
          1,
          isLight ? 'rgba(56, 189, 248, 0.08)' : 'rgba(16, 185, 129, 0.07)'
        );

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanLineY - 35, width, 35);

        // Crisp horizontal laser line
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.strokeStyle = isLight
          ? 'rgba(56, 189, 248, 0.28)'
          : 'rgba(52, 211, 153, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Edge scanner indicators on left and right
        ctx.font = '8px monospace';
        ctx.fillStyle = isLight ? 'rgba(59, 130, 246, 0.6)' : 'rgba(52, 211, 153, 0.6)';
        ctx.fillText('OPTICAL_SCAN // ACTIVE', 24, scanLineY - 4);
        ctx.fillText('RESIDENCE_GRID_LOCK', width - 150, scanLineY - 4);
      }

      // Corner reticles / brackets
      const drawBracket = (x, y, size, flipX, flipY) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      };

      drawBracket(28, 28, 14, false, false);
      drawBracket(width - 28, 28, 14, true, false);
      drawBracket(28, height - 28, 14, false, true);
      drawBracket(width - 28, height - 28, 14, true, true);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="security-radar-canvas"
      aria-hidden="true"
    />
  );
}
