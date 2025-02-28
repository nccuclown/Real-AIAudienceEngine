// ConsumerDatabase.js - 消費者資料庫模組
// 負責展示數百萬消費者輪廓的球體資料庫及其動畫效果

import React, { useState, useEffect } from "react";
import { config, clampPercentage, getColorArray } from "./config";

// 完全重寫的生成粒子函數 - 確保粒子在中央區域而非邊界上
export const generateSphereParticles = () => {
  const particles = [];
  // 使用極其明亮的顏色
  const colors = [
    "#FF9500", // 明亮的橙色
    "#FF3B30", // 明亮的紅色
    "#34C759", // 明亮的綠色
    "#007AFF", // 明亮的藍色
    "#FFCC00", // 明亮的黃色
    "#AF52DE", // 明亮的紫色
  ];
  const { audienceTraits, particleCount } = config.audienceData;

  // 半徑範圍 - 確保粒子分布在球體內部
  const minRadius = 5;
  const maxRadius = 25;

  for (let i = 0; i < particleCount; i++) {
    // 隨機角度
    const theta = Math.random() * Math.PI * 2; // 水平角度 0-2π
    const phi = Math.random() * Math.PI; // 垂直角度 0-π

    // 隨機半徑 - 使用立方根分布使粒子更均勻
    const r =
      minRadius + Math.pow(Math.random(), 1 / 3) * (maxRadius - minRadius);

    // 絕對定位 - 使用固定的中心點50%,50%
    const centerX = 50;
    const centerY = 50;

    // 計算笛卡爾坐標 - 將球坐標轉換為絕對位置
    const x = centerX + r * Math.sin(phi) * Math.cos(theta);
    const y = centerY + r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    // 從特徵中隨機選一個
    const traitIndex = Math.floor(Math.random() * audienceTraits.length);
    const trait = audienceTraits[traitIndex];

    const color = colors[i % colors.length]; // 確保顏色平均分配

    // 基本粒子屬性 - 大且明顯
    const particle = {
      id: `particle-${Date.now()}-${i}`,
      x, // 不使用clampPercentage，直接使用計算的坐標
      y, // 不使用clampPercentage，直接使用計算的坐標
      z,
      displayX: x,
      displayY: y,
      displayZ: z,
      theta,
      phi,
      radius: r,
      size: 4 + Math.random() * 4, // 大粒子
      color,
      opacity: 0.9, // 高不透明度
      trait,
      // 每8個粒子顯示1個標籤
      showTrait: i % 8 === 0,
      // 為標籤分配隨機角度，確保它們不會全部堆疊
      labelAngle: Math.random() * 360,
      labelDistance: 10 + Math.random() * 15, // 標籤到粒子的距離
      highlighted: false,
      matched: false,
    };

    particles.push(particle);
  }

  return particles;
};

// 更新球體粒子 - 使用固定中心點進行計算
export const updateSphereParticles = (
  particles,
  sphereRotation,
  showMatching
) => {
  // 固定中心點
  const centerX = 50;
  const centerY = 50;

  return particles.map((particle, index) => {
    // 更明顯的呼吸效果
    const breathFactor = Math.sin(Date.now() * 0.0005 + index * 0.1) * 0.15;

    // 旋轉角度 - 只旋轉theta角度，保持phi不變
    const rotatedTheta = particle.theta + (sphereRotation * Math.PI) / 180;

    // 調整後的半徑
    const adjustedRadius = particle.radius * (1 + breathFactor);

    // 計算新的位置
    const x =
      centerX +
      adjustedRadius * Math.sin(particle.phi) * Math.cos(rotatedTheta);
    const y =
      centerY +
      adjustedRadius * Math.sin(particle.phi) * Math.sin(rotatedTheta);
    const z = adjustedRadius * Math.cos(particle.phi);

    // 計算Z軸視覺效果
    const normalizedZ = (z + particle.radius) / (particle.radius * 2); // 0-1範圍
    const displayOpacity = 0.3 + normalizedZ * 0.7; // 0.3-1範圍
    const sizeFactor = 0.7 + normalizedZ * 0.6; // 0.7-1.3範圍

    return {
      ...particle,
      displayX: x,
      displayY: y,
      displayZ: z,
      displayOpacity,
      sizeFactor,
      // 發光效果基於正面位置
      glowing: normalizedZ > 0.7 || (showMatching && particle.matched),
    };
  });
};

// 格式化數字為逗號分隔的字符串
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 消費者資料庫組件
export const ConsumerDatabase = ({
  progress,
  showSphere,
  audienceParticles,
  dataCount,
}) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [debugBorder, setDebugBorder] = useState(true); // 調試用邊框

  // 使用useEffect輸出調試信息
  useEffect(() => {
    console.log(
      `ConsumerDatabase: showSphere=${showSphere}, 粒子數=${audienceParticles.length}, 進度=${progress}`
    );
  }, [showSphere, audienceParticles, progress]);

  // 使用動畫逐步增加計數，從1開始
  useEffect(() => {
    if (!showSphere) {
      setDisplayCount(0);
      return;
    }

    // 開始計數動畫
    let startCount = 1;
    const targetCount = dataCount;
    const duration = 5000; // 5秒內完成計數
    const interval = 50; // 每50ms更新一次
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
  }, [showSphere, dataCount]);

  // 為了測試，即使showSphere為false也顯示空容器
  if (!showSphere) {
    return (
      <div
        className="sphere-container"
        style={{
          border: debugBorder ? "2px dashed red" : "none",
          opacity: 0.3,
          position: "absolute",
          inset: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "red",
          }}
        >
          球體未顯示 (進度: {progress.toFixed(1)}%)
        </div>
      </div>
    );
  }

  return (
    <div
      className="sphere-container"
      style={{
        border: debugBorder ? "2px solid lime" : "none",
        position: "absolute",
        inset: 0,
        overflow: "visible", // 確保標籤不被裁剪
      }}
    >
      {/* 添加球體背景發光效果 */}
      <div
        style={{
          position: "absolute",
          width: "120px",
          height: "120px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(15px)",
          zIndex: 95,
        }}
      />

      {audienceParticles.map((particle, index) => {
        // 使用粒子的計算屬性
        const displayX =
          particle.displayX !== undefined ? particle.displayX : particle.x;
        const displayY =
          particle.displayY !== undefined ? particle.displayY : particle.y;
        const displayOpacity =
          particle.displayOpacity !== undefined
            ? particle.displayOpacity
            : particle.opacity;
        const sizeFactor =
          particle.sizeFactor !== undefined ? particle.sizeFactor : 1;

        // 計算粒子大小
        const displaySize = particle.size * sizeFactor;

        // 特徵標籤位置計算 - 直接從粒子位置偏移
        const shouldShowTrait = particle.showTrait;

        // 為標籤計算獨立位置，避免疊加
        const labelAngle = particle.labelAngle || (index * 45) % 360; // 以45度間隔分布
        const labelRadian = (labelAngle * Math.PI) / 180;
        const labelDistance = particle.labelDistance || 15;

        // 計算標籤的位置 - 相對於中心點
        const centerX = 50;
        const centerY = 50;
        const labelX = centerX + labelDistance * Math.cos(labelRadian);
        const labelY = centerY + labelDistance * Math.sin(labelRadian);

        return (
          <div key={particle.id} className="particle-wrapper">
            {/* 粒子本身 */}
            <div
              className="particle"
              style={{
                position: "absolute",
                left: `${displayX}%`,
                top: `${displayY}%`,
                width: `${displaySize}px`,
                height: `${displaySize}px`,
                backgroundColor: particle.color,
                opacity: displayOpacity,
                zIndex: 100,
                boxShadow: particle.glowing
                  ? `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`
                  : `0 0 5px ${particle.color}`,
                transform: `scale(${sizeFactor})`,
                border: `1px solid ${particle.color}`,
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />

            {/* 特性標籤 - 使用絕對位置 */}
            {shouldShowTrait && (
              <div
                className="particle-label"
                style={{
                  position: "absolute",
                  left: `${labelX}%`,
                  top: `${labelY}%`,
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  backgroundColor: `${particle.color}99`,
                  zIndex: 150,
                  opacity: 0.9,
                  maxWidth: "120px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  boxShadow: `0 0 8px ${particle.color}`,
                  padding: "3px 6px",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  borderRadius: "4px",
                  pointerEvents: "none",
                  border: `1px solid ${particle.color}`,
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
          <div className="counter-value">{formatNumber(displayCount)}</div>
          <div className="counter-label">消費者輪廓資料庫</div>
        </div>
      )}

      {/* 調試資訊 - 開發完畢後應移除 */}
      {debugBorder && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "lime",
            padding: "4px 8px",
            fontSize: "12px",
            zIndex: 300,
          }}
        >
          粒子數: {audienceParticles.length} | 進度: {progress.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ConsumerDatabase;
