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
    const radius = 60; // 進一步增加半徑
    const x = 50 + radius * Math.sin(phi) * Math.cos(theta);
    const y = 50 + radius * Math.sin(phi) * Math.sin(theta);
    const z = Math.max(-60, Math.min(60, radius * Math.cos(phi))); // 調整 z 範圍

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
      size: 5 + Math.random() * 5, // 增加基本尺寸
      color,
      opacity: 0.8 + Math.random() * 0.2, // 提高透明度
      trait,
      showTrait: Math.random() < 0.15,
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
    const breathFactor =
      Math.sin(Date.now() * 0.001 + particle.id.charCodeAt(0)) * 0.05;
    const rotatedTheta = particle.theta + (sphereRotation * Math.PI) / 180;
    const displayX =
      50 + particle.radius * Math.sin(particle.phi) * Math.cos(rotatedTheta);
    const displayY =
      50 + particle.radius * Math.sin(particle.phi) * Math.sin(rotatedTheta);
    const displayZ = Math.max(
      -60,
      Math.min(60, particle.radius * Math.cos(particle.phi))
    );

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

const formatNumber = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
        const scale = (particle.displayZ + 60) / 120; // 調整 scale 計算範圍
        const displaySize = Math.max(
          4,
          particle.size * (0.5 + Math.max(0.1, scale))
        ); // 確保最小尺寸
        const displayOpacity = Math.min(
          1,
          Math.max(0, particle.opacity * Math.max(0.1, scale || 0.1))
        ); // 防止 NaN

        const shouldShowTrait = particle.showTrait && scale > 0.7;
        const labelX = Math.min(
          Math.max(particle.displayX + Math.random() * 15 - 7.5, 5),
          95
        ); // 增加隨機偏移
        const labelY = Math.min(
          Math.max(particle.displayY - 15 + Math.random() * 15 - 7.5, 5),
          95
        );

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
                zIndex: Math.min(Math.floor(particle.displayZ + 50), 150),
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
                  zIndex: Math.min(Math.floor(particle.displayZ + 51), 151),
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
      {progress <= 15 && (
        <div
          className="database-counter fade-in"
          style={{
            zIndex: 200,
            top: "30%",
            transform: "translate(-50%, -50%)",
            animation: "fadeOut 1s forwards 10s",
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
