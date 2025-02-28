// ConsumerDatabase.js
import React, { useState, useEffect } from "react";
import { config, clampPercentage, getColorArray } from "./config";

export const generateSphereParticles = () => {
  // 仍然返回粒子數組，但我們不會呈現它們
  const particles = [];
  console.log("生成球體粒子數量:", particles.length);
  return particles;
};

export const updateSphereParticles = (
  particles,
  sphereRotation,
  showMatching
) => {
  // 直接返回粒子，但不會被渲染
  return particles;
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
    if (!showSphere) {
      setDisplayCount(0);
      return;
    }

    let startCount = 1;
    const targetCount = 5000000; // 設置目標數為500萬
    const duration = 10000; // 增加持續時間到10秒，給用戶足夠時間觀察
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
  }, [showSphere]); // 移除所有其他依賴

  if (!showSphere) return null;

  return (
    <div className="sphere-container">
      {/* 移除了所有球體粒子的渲染 */}

      {progress <= 18 && (
        <div
          className="database-counter fade-in"
          style={{
            zIndex: 200,
            top: "50%", // 調整到中央
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: progress > 15 ? "fadeOut 1s forwards" : "none",
            padding: "15px 25px",
            backdropFilter: "blur(5px)",
            boxShadow: "0 0 20px rgba(255, 187, 0, 0.5)",
          }}
        >
          <div className="counter-value">{formatNumber(displayCount)}</div>
          <div className="counter-label">消費者輪廓資料庫</div>
          <div className="counter-sublabel" style={{ marginTop: "5px", fontSize: "0.9rem", color: "#ffdd77" }}>
            收集標籤數: {Math.floor(displayCount * 0.35 / 1000)}K+ 種
          </div>
          <div className="data-categories" style={{ marginTop: "10px", fontSize: "0.8rem", color: "#ffffff", display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ opacity: progress > 4 ? 1 : 0.2, transition: "opacity 0.5s" }}>
              <span style={{ color: "#ffbb00" }}>●</span> 廣告點擊行為: {progress > 4 ? Math.floor(displayCount * 0.15 / 1000) : 0}K+
            </div>
            <div style={{ opacity: progress > 8 ? 1 : 0.2, transition: "opacity 0.5s" }}>
              <span style={{ color: "#ff8a00" }}>●</span> 閱覽興趣偏好: {progress > 8 ? Math.floor(displayCount * 0.22 / 1000) : 0}K+
            </div>
            <div style={{ opacity: progress > 12 ? 1 : 0.2, transition: "opacity 0.5s" }}>
              <span style={{ color: "#26c6da" }}>●</span> 零售消費行為: {progress > 12 ? Math.floor(displayCount * 0.18 / 1000) : 0}K+
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDatabase;