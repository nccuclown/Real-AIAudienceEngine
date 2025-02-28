// ConsumerDatabase.js
import React, { useState, useEffect } from "react";
import { config, clampPercentage, getColorArray } from "./config";

export const generateSphereParticles = () => {
  const particles = [];
  const colors = getColorArray();
  const { audienceTraits, particleCount } = config.audienceData;

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 750; // 放大球體半徑十倍
    const x = 50 + radius * Math.sin(phi) * Math.cos(theta) / 10; // 調整x座標比例
    const y = 50 + radius * Math.sin(phi) * Math.sin(theta) / 10; // 調整y座標比例
    const z = Math.max(-750, Math.min(750, radius * Math.cos(phi)));

    const traitIndex = Math.floor(Math.random() * audienceTraits.length);
    const trait = audienceTraits[traitIndex];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const particle = {
      id: `particle-${Date.now()}-${i}`,
      x: clampPercentage(x),
      y: clampPercentage(y),
      z,
      phi,
      theta,
      radius,
      size: 60 + Math.random() * 60, // 放大粒子尺寸十倍
      color,
      opacity: 0.9 + Math.random() * 0.1, // 提高整體透明度
      trait,
      showTrait: Math.random() < 0.35, // 進一步增加標籤顯示比例
      highlighted: false,
      matched: false,
    };

    particles.push(particle);
  }

  console.log("生成球體粒子數量:", particles.length);
  return particles;
};

export const updateSphereParticles = (
  particles,
  sphereRotation,
  showMatching
) => {
  return particles.map((particle) => {
    const breathFactor = Math.sin(Date.now() * 0.001 + particle.id.charCodeAt(0)) * 0.05;
    const rotatedTheta = particle.theta + (sphereRotation * Math.PI) / 180;
    const displayX = 50 + particle.radius * Math.sin(particle.phi) * Math.cos(rotatedTheta);
    const displayY = 50 + particle.radius * Math.sin(particle.phi) * Math.sin(rotatedTheta);
    const displayZ = Math.max(-60, Math.min(60, particle.radius * Math.cos(particle.phi)));

    let adjustedRadius = particle.radius;
    if (showMatching && particle.matched) adjustedRadius *= 0.9;

    return {
      ...particle,
      displayX: clampPercentage(displayX),
      displayY: clampPercentage(displayY),
      displayZ,
      radius: adjustedRadius * (1 + breathFactor),
      glowing: showMatching && particle.matched && Math.random() < 0.1,
    };
  });
};

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const ConsumerDatabase = ({
  progress,
  showSphere,
  audienceParticles,
  dataCount,
}) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!showSphere || audienceParticles.length === 0) {
      setDisplayCount(0);
      return;
    }

    let startCount = 1;
    const targetCount = dataCount;
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    const increment = (targetCount - startCount) / steps;

    let currentCount = startCount;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(timer);
      }
      setDisplayCount(Math.floor(currentCount));
    }, interval);

    return () => clearInterval(timer);
  }, [showSphere, dataCount, audienceParticles.length]);

  if (!showSphere || audienceParticles.length === 0) return null;

  return (
    <div className="sphere-container">
      {audienceParticles.map((particle) => {
        const scale = (particle.displayZ + 750) / 1500 || 0.1; // 調整縮放比例
        const displaySize = Math.max(50, particle.size * (0.6 + Math.max(0.1, scale)));
        const displayOpacity = Math.min(1, Math.max(0, particle.opacity * Math.max(0.2, scale)));
        const displayZIndex = Math.min(Math.max(0, Math.floor(isFinite(particle.displayZ) ? particle.displayZ + 500 : 500)), 1500); // 確保 zIndex 有效

        const shouldShowTrait = particle.showTrait && scale > 0.6; // 降低標籤顯示門檻
        const labelX = Math.min(Math.max(particle.displayX + (Math.random() * 10 - 5), 10), 90);
        const labelY = Math.min(Math.max(particle.displayY - 12, 10), 90);

        return (
          <div key={particle.id} className="particle-wrapper">
            <div
              className="particle"
              style={{
                left: `${particle.displayX}%`,
                top: `${particle.displayY}%`,
                width: `${displaySize}px`,
                height: `${displaySize}px`,
                backgroundColor: particle.color,
                opacity: displayOpacity,
                zIndex: displayZIndex,
                boxShadow: particle.glowing
                  ? `0 0 15px ${particle.color}, 0 0 30px ${particle.color}`
                  : particle.highlighted
                  ? `0 0 10px ${particle.color}`
                  : `0 0 3px ${particle.color}`,
                transform: particle.highlighted ? "scale(1.5)" : "scale(1)",
              }}
            />
            {shouldShowTrait && (
              <div
                className="particle-label"
                style={{
                  left: `${labelX}%`,
                  top: `${labelY}%`,
                  color: particle.color,
                  zIndex: displayZIndex + 1,
                  opacity: Math.min(1, displayOpacity * 1.3),
                  maxWidth: "150px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transform: "translateX(-50%)",
                }}
              >
                {particle.trait}
              </div>
            )}
          </div>
        );
      })}
      {progress <= 18 && (
        <div
          className="database-counter fade-in"
          style={{
            zIndex: 200,
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: progress > 15 ? "fadeOut 1s forwards" : "none",
          }}
        >
          <div className="counter-value">{formatNumber(displayCount)}</div>
          <div className="counter-label">消費者輪廓資料庫</div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDatabase;