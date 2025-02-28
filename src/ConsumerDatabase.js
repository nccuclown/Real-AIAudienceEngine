// ConsumerDatabase.js - 消費者資料庫模組
// 負責展示數百萬消費者輪廓的球體資料庫及其動畫效果

import React from "react";
import { config, clampPercentage, getColorArray } from "./config";

// 生成3D球體的粒子
export const generateSphereParticles = () => {
  const particles = [];
  const colors = getColorArray();
  const { audienceTraits, particleCount } = config.audienceData;

  for (let i = 0; i < particleCount; i++) {
    // 在球體表面上均勻分布點
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;

    // 基於球坐標計算笛卡爾坐標
    const radius = 42; // 球體半徑
    const x = 50 + radius * Math.sin(phi) * Math.cos(theta);
    const y = 50 + radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi); // z座標用於深度效果

    // 從特徵中隨機選一個
    const traitIndex = Math.floor(Math.random() * audienceTraits.length);
    const trait = audienceTraits[traitIndex];

    const color = colors[Math.floor(Math.random() * colors.length)];

    // 基本粒子屬性
    const particle = {
      id: `particle-${Date.now()}-${i}`,
      x: clampPercentage(x),
      y: clampPercentage(y),
      z,
      phi,
      theta,
      radius,
      size: 1 + Math.random() * 1.5,
      color,
      opacity: 0.4 + Math.random() * 0.4,
      trait,
      showTrait: Math.random() < 0.15, // 只有部分粒子顯示特徵
      highlighted: false,
      matched: false,
    };

    particles.push(particle);
  }

  return particles;
};

// 更新球體粒子 - 處理呼吸效果、旋轉和匹配高亮
export const updateSphereParticles = (
  particles,
  sphereRotation,
  showMatching
) => {
  return particles.map((particle) => {
    // 在原位置基礎上添加呼吸效果
    const breathFactor =
      Math.sin(Date.now() * 0.001 + particle.id.charCodeAt(0)) * 0.05;

    // 根據旋轉角度調整顯示位置
    const rotatedTheta = particle.theta + sphereRotation * (Math.PI / 180);

    // 新的顯示位置
    const displayX =
      50 + particle.radius * Math.sin(particle.phi) * Math.cos(rotatedTheta);
    const displayY =
      50 + particle.radius * Math.sin(particle.phi) * Math.sin(rotatedTheta);

    // 調整z值，用於視覺上的縮放
    const displayZ = particle.radius * Math.cos(particle.phi);

    // 如果是被匹配的粒子且在匹配階段，向中心輕微移動
    let adjustedRadius = particle.radius;
    if (showMatching && particle.matched) {
      adjustedRadius = particle.radius * 0.9; // 向中心收縮10%
    }

    return {
      ...particle,
      displayX: clampPercentage(displayX),
      displayY: clampPercentage(displayY),
      displayZ,
      radius: adjustedRadius * (1 + breathFactor),
      // 匹配時的發光效果
      glowing: showMatching && particle.matched && Math.random() < 0.1,
    };
  });
};

// 消費者資料庫組件
export const ConsumerDatabase = ({
  progress,
  showSphere,
  audienceParticles,
  dataCount,
}) => {
  if (!showSphere) return null;

  return (
    <div className="sphere-container">
      {audienceParticles.map((particle) => {
        // 計算大小和不透明度 - 根據Z軸位置進行調整
        const scale = (particle.displayZ + 50) / 100; // z值越大，顯示越大
        const displaySize = particle.size * (0.5 + scale);
        const displayOpacity = particle.opacity * scale;

        // 決定是否顯示特性
        const shouldShowTrait = particle.showTrait && scale > 0.7;

        return (
          <div key={particle.id} className="particle-wrapper">
            {/* 粒子本身 */}
            <div
              className="particle"
              style={{
                left: `${particle.displayX}%`,
                top: `${particle.displayY}%`,
                width: `${displaySize}px`,
                height: `${displaySize}px`,
                backgroundColor: particle.color,
                opacity: displayOpacity,
                zIndex: Math.floor(particle.displayZ + 100),
                boxShadow: particle.glowing
                  ? `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`
                  : particle.highlighted
                  ? `0 0 5px ${particle.color}`
                  : "none",
                transform: particle.highlighted ? "scale(1.5)" : "scale(1)",
              }}
            />

            {/* 特性標籤 */}
            {shouldShowTrait && (
              <div
                className="particle-label"
                style={{
                  left: `${particle.displayX + displaySize / 2}%`,
                  top: `${particle.displayY - 10}%`,
                  color: particle.color,
                  zIndex: Math.floor(particle.displayZ + 101),
                  opacity: displayOpacity * 1.3,
                }}
              >
                {particle.trait}
              </div>
            )}
          </div>
        );
      })}

      {/* 數據庫標籤 - 只在初始階段顯示 */}
      {progress <= 15 && (
        <div className="database-counter fade-in" style={{ zIndex: 200 }}>
          <div className="counter-value">{dataCount.toLocaleString()}</div>
          <div className="counter-label">消費者輪廓資料庫</div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDatabase;
