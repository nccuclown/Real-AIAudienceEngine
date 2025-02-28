// ClientDataFusion.js - 客戶數據融合模組
// 負責展示TNL MG Tag整合客戶數據的數據融合效果

import React from "react";
import { config, clampPercentage, getColorArray } from "./config";

// 生成客戶數據粒子
export const generateClientDataParticles = () => {
  const particles = [];
  const colors = getColorArray();
  const { clientDataTypes, particleCount } = config.clientData;

  for (let i = 0; i < particleCount; i++) {
    // 從數據類型中隨機選一個
    const dataIndex = Math.floor(Math.random() * clientDataTypes.length);
    const dataType = clientDataTypes[dataIndex];

    const color = colors[Math.floor(Math.random() * colors.length)];

    // 在左側區域隨機分佈
    const x = 15 + Math.random() * 20; // 調整左側範圍，避免與中央重疊
    const y = 30 + Math.random() * 40;

    // 基本粒子屬性
    const particle = {
      id: `client-${Date.now()}-${i}`,
      x: clampPercentage(x),
      y: clampPercentage(y),
      z: 0,
      size: 2 + Math.random() * 3,
      color,
      opacity: 0.4 + Math.random() * 0.6,
      dataType,
      showType: Math.random() < 0.2, // 20%的粒子顯示數據類型
      isClientData: true,
      isMerging: false,
      mergeProgress: 0,
    };

    particles.push(particle);
  }

  return particles;
};

// 更新客戶數據粒子 - 融合效果
export const updateClientDataParticles = (particles) => {
  return particles.map((particle) => {
    if (particle.isMerging) {
      // 更新融合進度
      const newProgress = Math.min(1, particle.mergeProgress + 0.01);

      // 融合路徑 - 從原位置到球體中心
      const startX = particle.x;
      const startY = particle.y;
      const endX = 50;
      const endY = 50;

      // 曲線路徑計算
      const t = newProgress;
      const mergeX = startX + (endX - startX) * t;
      const mergeY = startY + (endY - startY) * t;

      // 如果完成融合，重置位置
      if (newProgress >= 1) {
        return {
          ...particle,
          x: clampPercentage(15 + Math.random() * 20),
          y: clampPercentage(30 + Math.random() * 40),
          mergeProgress: 0,
          isMerging: Math.random() < 0.3, // 30%概率繼續融合
        };
      }

      return {
        ...particle,
        displayX: clampPercentage(mergeX),
        displayY: clampPercentage(mergeY),
        mergeProgress: newProgress,
        opacity: 1 - newProgress * 0.8, // 漸漸變透明
      };
    }

    // 非融合狀態的粒子只有輕微抖動
    return {
      ...particle,
      displayX: clampPercentage(particle.x + (Math.random() - 0.5) * 0.5),
      displayY: clampPercentage(particle.y + (Math.random() - 0.5) * 0.5),
      opacity: 0.6 + Math.random() * 0.4,
    };
  });
};

// 客戶數據融合組件
export const ClientDataFusion = ({
  showDataFusion,
  clientDataParticles,
  progress,
}) => {
  // 確保只在對應階段顯示
  if (!showDataFusion) return null;

  return (
    <div className="data-fusion-container">
      {/* 客戶數據框 */}
      <div className="client-data-box fade-in floating-panel">
        <div className="data-box-header">
          <span className="data-box-title">客戶第一方數據</span>
        </div>

        {/* TNL MG Tag標籤 */}
        <div className={`tnl-tag ${progress > 50 ? "pulse-card" : ""}`}>
          TNL MG Tag
        </div>
      </div>

      {/* 數據粒子 */}
      {clientDataParticles.map((particle) => {
        const displayX = particle.isMerging
          ? particle.displayX
          : particle.displayX || particle.x;
        const displayY = particle.isMerging
          ? particle.displayY
          : particle.displayY || particle.y;

        return (
          <div key={particle.id} className="particle-wrapper">
            {/* 數據點 */}
            <div
              className="data-particle"
              style={{
                left: `${displayX}%`,
                top: `${displayY}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.isMerging
                  ? particle.opacity * 0.8
                  : particle.opacity,
                boxShadow: particle.isMerging
                  ? `0 0 10px ${particle.color}`
                  : "none",
              }}
            />

            {/* 數據類型標籤 */}
            {particle.showType && !particle.isMerging && (
              <div
                className="particle-label"
                style={{
                  left: `${displayX + particle.size / 2}%`,
                  top: `${displayY - 8}%`,
                  color: particle.color,
                  opacity: particle.opacity * 1.2,
                  border: `1px solid ${particle.color}`,
                }}
              >
                {particle.dataType}
              </div>
            )}
          </div>
        );
      })}

      {/* 數據融合光線 */}
      {progress > 50 && (
        <svg className="fusion-svg">
          <defs>
            <linearGradient
              id="fusionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={config.colors.primary}
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor={config.colors.accent}
                stopOpacity="0.8"
              />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path
            d="M30,40 C40,45 45,48 50,50"
            stroke="url(#fusionGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            filter="url(#glow)"
            className="pulse-line"
          />
        </svg>
      )}
    </div>
  );
};

export default ClientDataFusion;
