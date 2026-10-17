import React, { useEffect, useRef } from 'react';

/**
 * AdvancedSecurityBackground
 * Elite, high-performance 60 FPS Canvas background simulating an advanced autonomous
 * AI residence defense and perimeter surveillance deck:
 * 1. Multi-ring precision biometric radar gimbal with degree markings & sweep beam
 * 2. Active target detection blips with expanding ping rings & telemetry HUD tags
 * 3. Interactive optical cursor tracking reticle with smooth spring damping
 * 4. Ground-plane 3D Lidar perspective grid simulating front porch depth
 * 5. Dynamic AI audio converse oscilloscope waveform representing real-time speech analysis
 * 6. Live cryptographic telemetry feeds along margins (AES-256, SHA-256, Zero-Trust locks)
 * 7. Hexagonal cyber perimeter shield pulses
 * 8. Theme adaptive (Dark Mode: Cyber Obsidian & Emerald/Cyan; Light Mode: Orchid Royal Blue & Sky)
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

    // Interactive mouse tracking with damped spring lag
    let mouseX = width * 0.5;
    let mouseY = height * 0.4;
    let targetX = mouseX;
    let targetY = mouseY;
    let isMouseInside = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseInside = true;
    };

    const handleMouseLeave = () => {
      isMouseInside = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Radar state
    let radarAngle = 0;
    const radarSpeed = 0.009;
    let gimbalAngle = 0;

    // Optical laser scan sweep state
    let scanLineY = 0;
    const scanLineSpeed = 1.4;

    // Concentric sonar pulse rings
    const sonarRings = [
      { radius: 30, maxRadius: 360, speed: 0.9 },
      { radius: 140, maxRadius: 360, speed: 0.9 },
      { radius: 250, maxRadius: 360, speed: 0.9 },
    ];

    // Detection targets (blips) around the radar origin
    const targets = [
      { angle: 0.75, dist: 120, label: 'CAM_01 [FRONT_GATE]', pulse: 0, tag: 'OPTICAL' },
      { angle: 2.15, dist: 195, label: 'DEL_001 [AMAZON_MATCH]', pulse: 0, tag: 'AUTHORIZED' },
      { angle: 3.55, dist: 160, label: 'LIDAR [PERIMETER_NORTH]', pulse: 0, tag: 'LIDAR' },
      { angle: 4.85, dist: 240, label: 'AUDIO_ARRAY [CONVERSE]', pulse: 0, tag: 'NLP_SPEECH' },
      { angle: 5.80, dist: 105, label: 'DOOR_STRIKE [ARMED]', pulse: 0, tag: 'ZERO_TRUST' },
      { angle: 1.45, dist: 280, label: 'CARRIER_GPS [FEDEX_OUT]', pulse: 0, tag: 'TELEMETRY' },
    ];

    // Floating telemetry network particles
    const particleCount = Math.min(Math.floor(width / 40), 38);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Live telemetry log items for side stream HUD
    const telemetryItems = [
      'GUESTVERIFY // ZERO_TRUST_ARMED',
      'CRYPTO_LEDGER: decisions.jsonl',
      'OPTICAL_STREAM: 1080P // 60FPS',
      'ROSTER_MATCH: deliveries.json',
      'AES_256_GCM // CIPHER_SECURE',
      'BIOMETRIC_HUD // STATE: ACTIVE',
      'NLP_SENTIMENT: CONVERSATIONAL',
      'PERIMETER_GRID // 360_SWEEP_OK',
    ];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor follower interpolation
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      // Color scheme tokens
      const primaryColor = isLight ? 'rgba(37, 99, 235,' : 'rgba(16, 185, 129,';
      const secondaryColor = isLight ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
      const accentColor = isLight ? 'rgba(56, 189, 248,' : 'rgba(52, 211, 153,';
      const hudTextColor = isLight ? 'rgba(30, 41, 59, 0.45)' : 'rgba(148, 163, 184, 0.45)';

      // =========================================================================
      // 1. 3D LIDAR GROUND-PLANE PERSPECTIVE GRID (FRONT PORCH DEPTH)
      // =========================================================================
      const horizonY = height * 0.65;
      const fovX = width * 0.5;

      ctx.save();
      ctx.beginPath();
      const perspectiveLines = 14;
      for (let i = -perspectiveLines; i <= perspectiveLines; i++) {
        const bottomX = fovX + i * (width / perspectiveLines) * 1.5;
        ctx.moveTo(fovX + i * 2, horizonY);
        ctx.lineTo(bottomX, height);
      }
      ctx.strokeStyle = isLight ? 'rgba(99, 102, 241, 0.035)' : 'rgba(6, 182, 212, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Horizontal forward-moving Lidar wave rings
      const groundGridSteps = 8;
      const speedOffset = (frame * 0.8) % (height - horizonY);
      for (let i = 0; i < groundGridSteps; i++) {
        const norm = (i / groundGridSteps + speedOffset / (height - horizonY)) % 1;
        const lineY = horizonY + Math.pow(norm, 2) * (height - horizonY);
        const alpha = Math.sin(norm * Math.PI) * (isLight ? 0.06 : 0.08);

        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.strokeStyle = `${primaryColor} ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // =========================================================================
      // 2. MULTI-RING BIOMETRIC RADAR GIMBAL (OVERHEAD RESIDENCE SENSOR)
      // =========================================================================
      const radarX = width * 0.5;
      const radarY = 110;
      const radarMaxRadius = Math.min(width * 0.42, 340);

      // Concentric expanding sonar rings
      sonarRings.forEach((ring) => {
        ring.radius += ring.speed;
        if (ring.radius > ring.maxRadius) {
          ring.radius = 20;
        }

        const ringProgress = ring.radius / ring.maxRadius;
        const ringAlpha = (1 - ringProgress) * (isLight ? 0.32 : 0.28);

        ctx.beginPath();
        ctx.arc(radarX, radarY, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${primaryColor} ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Fixed distance perimeter boundaries (15m, 30m, 50m)
      [0.32, 0.65, 1.0].forEach((fraction, idx) => {
        const r = radarMaxRadius * fraction;
        ctx.beginPath();
        ctx.arc(radarX, radarY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isLight ? 'rgba(99, 102, 241, 0.08)' : 'rgba(56, 189, 248, 0.09)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // High-tech zone indicator
        ctx.font = '8px monospace';
        ctx.fillStyle = hudTextColor;
        ctx.fillText(`PERIMETER_0${idx + 1} // ${Math.round(fraction * 50)}M`, radarX + r + 6, radarY + 3);
      });

      // Rotating mechanical gimbal compass ring with tick marks
      gimbalAngle += 0.003;
      ctx.save();
      ctx.translate(radarX, radarY);
      ctx.rotate(gimbalAngle);
      const gimbalRadius = radarMaxRadius * 0.85;

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
        const x1 = Math.cos(a) * (gimbalRadius - 5);
        const y1 = Math.sin(a) * (gimbalRadius - 5);
        const x2 = Math.cos(a) * gimbalRadius;
        const y2 = Math.sin(a) * gimbalRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Cardinal crosshairs through radar
      ctx.beginPath();
      ctx.moveTo(radarX - radarMaxRadius - 20, radarY);
      ctx.lineTo(radarX + radarMaxRadius + 20, radarY);
      ctx.moveTo(radarX, radarY - radarMaxRadius - 10);
      ctx.lineTo(radarX, radarY + radarMaxRadius + 15);
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sweeping radar wedge
      radarAngle = (radarAngle + radarSpeed) % (Math.PI * 2);
      const sweepAngleSpan = 0.58;

      const sweepGrad = ctx.createRadialGradient(radarX, radarY, 0, radarX, radarY, radarMaxRadius);
      if (isLight) {
        sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        sweepGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
        sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      } else {
        sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.36)');
        sweepGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.16)');
        sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(radarX, radarY);
      ctx.arc(radarX, radarY, radarMaxRadius, radarAngle - sweepAngleSpan, radarAngle, false);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading sharp laser sweep ray
      ctx.beginPath();
      ctx.moveTo(radarX, radarY);
      ctx.lineTo(
        radarX + Math.cos(radarAngle) * radarMaxRadius,
        radarY + Math.sin(radarAngle) * radarMaxRadius
      );
      ctx.strokeStyle = `${accentColor} 0.8)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // =========================================================================
      // 3. TARGET BLIPS WITH DETECTION PULSES & HUD LABELS
      // =========================================================================
      targets.forEach((target) => {
        const tx = radarX + Math.cos(target.angle) * target.dist;
        const ty = radarY + Math.sin(target.angle) * target.dist;

        // Check if radar sweep just passed over this target
        const angleDiff = (radarAngle - target.angle + Math.PI * 2) % (Math.PI * 2);
        if (angleDiff < 0.15) {
          target.pulse = 1.0;
        } else {
          target.pulse = Math.max(0, target.pulse - 0.016);
        }

        const currentAlpha = Math.min(1, (isLight ? 0.4 : 0.35) + target.pulse * 0.65);

        // Target blip center dot
        ctx.beginPath();
        ctx.arc(tx, ty, target.pulse > 0 ? 3.8 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `${accentColor} ${currentAlpha})`;
        ctx.fill();

        // Expanding ping shockwave ring
        if (target.pulse > 0.08) {
          ctx.beginPath();
          ctx.arc(tx, ty, 5 + (1 - target.pulse) * 20, 0, Math.PI * 2);
          ctx.strokeStyle = `${accentColor} ${target.pulse * 0.7})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Target HUD callout label
        if (target.pulse > 0.04 || frame % 120 < 90) {
          ctx.font = '8px monospace';
          ctx.fillStyle = isLight
            ? `rgba(30, 41, 59, ${currentAlpha * 0.9})`
            : `rgba(226, 232, 240, ${currentAlpha * 0.85})`;
          ctx.fillText(`[${target.tag}] ${target.label}`, tx + 8, ty - 4);
        }
      });

      // =========================================================================
      // 4. FLOATING TELEMETRY NODES & CONNECTING LASER MESH
      // =========================================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = Math.sin(frame * p.pulseSpeed) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${secondaryColor} ${p.alpha * pulse * 0.6})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * (isLight ? 0.14 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${primaryColor} ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // =========================================================================
      // 5. INTERACTIVE OPTICAL CURSOR TARGETING GIMBAL (TRACKING VISITOR)
      // =========================================================================
      if (isMouseInside && targetX > 0 && targetY > 0) {
        const reticleRadius = 26;
        ctx.save();
        ctx.translate(targetX, targetY);

        // Rotating outer brackets
        ctx.rotate(frame * 0.015);
        ctx.beginPath();
        ctx.arc(0, 0, reticleRadius, 0, Math.PI * 0.4);
        ctx.arc(0, 0, reticleRadius, Math.PI * 0.5, Math.PI * 0.9);
        ctx.arc(0, 0, reticleRadius, Math.PI * 1.0, Math.PI * 1.4);
        ctx.arc(0, 0, reticleRadius, Math.PI * 1.5, Math.PI * 1.9);
        ctx.strokeStyle = `${secondaryColor} 0.35)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center crosshair
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 6);
        ctx.strokeStyle = `${accentColor} 0.55)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Dynamic coordinate tag following cursor
        ctx.font = '8px monospace';
        ctx.fillStyle = isLight ? 'rgba(30, 41, 59, 0.65)' : 'rgba(56, 189, 248, 0.65)';
        ctx.fillText(
          `LOCK: [X:${Math.round(targetX)} Y:${Math.round(targetY)}] // OPTICAL_TRACK`,
          targetX + 32,
          targetY + 4
        );

        // Laser link between cursor and closest telemetry node
        let closestDist = Infinity;
        let closestP = null;
        for (let i = 0; i < particles.length; i++) {
          const d = Math.hypot(particles[i].x - targetX, particles[i].y - targetY);
          if (d < closestDist && d < 180) {
            closestDist = d;
            closestP = particles[i];
          }
        }

        if (closestP) {
          ctx.beginPath();
          ctx.moveTo(targetX, targetY);
          ctx.lineTo(closestP.x, closestP.y);
          ctx.strokeStyle = `${accentColor} ${Math.max(0, 0.35 - closestDist / 500)})`;
          ctx.lineWidth = 0.9;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // =========================================================================
      // 6. AI AUDIO CONVERSE SPECTRAL OSCILLOSCOPE WAVEFORM
      // =========================================================================
      const waveY = height * 0.48;
      ctx.save();
      ctx.beginPath();
      const waveWidth = width;
      const wavePoints = 50;
      for (let i = 0; i <= wavePoints; i++) {
        const wx = (i / wavePoints) * waveWidth;
        const distFromCenter = Math.abs(wx - width * 0.5) / (width * 0.5);
        const envelope = Math.max(0, 1 - distFromCenter * 1.2);
        const waveAmp = Math.sin(i * 0.35 + frame * 0.04) * 14 + Math.sin(i * 0.7 - frame * 0.02) * 8;
        const wy = waveY + waveAmp * envelope;

        if (i === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.strokeStyle = isLight ? 'rgba(59, 130, 246, 0.08)' : 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // =========================================================================
      // 7. VERTICAL OPTICAL SCAN LASER SWEEP
      // =========================================================================
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
          isLight ? 'rgba(56, 189, 248, 0.10)' : 'rgba(16, 185, 129, 0.09)'
        );

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanLineY - 35, width, 35);

        // Crisp laser line
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.strokeStyle = `${accentColor} 0.45)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Edge scanner indicators on left and right
        ctx.font = '8px monospace';
        ctx.fillStyle = `${accentColor} 0.75)`;
        ctx.fillText('OPTICAL_SCAN // ACTIVE', 24, scanLineY - 5);
        ctx.fillText('RESIDENCE_GRID_LOCK', width - 150, scanLineY - 5);
      }

      // =========================================================================
      // 8. SIDE MARGIN CRYPTOGRAPHIC TELEMETRY STREAMS
      // =========================================================================
      ctx.font = '7.5px monospace';
      ctx.fillStyle = hudTextColor;

      // Left gutter telemetry stream
      telemetryItems.slice(0, 4).forEach((item, idx) => {
        ctx.fillText(item, 26, height * 0.22 + idx * 16);
      });

      // Right gutter telemetry stream
      telemetryItems.slice(4).forEach((item, idx) => {
        const textWidth = ctx.measureText(item).width;
        ctx.fillText(item, width - textWidth - 26, height * 0.22 + idx * 16);
      });

      // =========================================================================
      // 9. HIGH-TECH CORNER RETICLE BRACKETS
      // =========================================================================
      const drawBracket = (x, y, size, flipX, flipY) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';
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
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
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
