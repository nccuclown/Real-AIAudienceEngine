
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
  const [animationComplete, setAnimationComplete] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (!showSphere) {
      setDisplayCount(0);
      setAnimationComplete(false);
      setInternalProgress(0);
      return;
    }

    let startCount = 1;
    const targetCount = 3000000; // 設置正確的目標數為300萬
    const duration = 12000; // 持續時間12秒
    const interval = 30;
    const steps = duration / interval;
    const increment = (targetCount - startCount) / steps;
    
    let currentCount = startCount;
    const timer = setInterval(() => {
      currentCount += increment;
      
      // 更新內部進度，用於控制顯示
      setInternalProgress(prev => Math.min(100, prev + 100/steps));
      
      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(timer);
        
        // 必須確保計數完成才標記動畫完成
        setAnimationComplete(true);
        console.log("消費者資料庫動畫計數完成:", targetCount);
        
        // 使用自定義事件通知父組件此動畫已完成
        setTimeout(() => {
          const event = new CustomEvent('sphereAnimationComplete');
          window.dispatchEvent(event);
          console.log("發送球體動畫完成事件");
        }, 1000); // 給一些緩衝時間確保UI更新
      }
      
      setDisplayCount(Math.floor(currentCount));
    }, interval);

    return () => clearInterval(timer);
  }, [showSphere]); // 簡化依賴

  if (!showSphere) return null;

  // 計算內部階段
  const showCategoryA = internalProgress > 20;
  const showCategoryB = internalProgress > 40;
  const showCategoryC = internalProgress > 60;
  const fadeOut = internalProgress > 85;

  return (
    <div className="sphere-container">
      {/* 移除了所有球體粒子的渲染 */}

      <div
        className="database-counter fade-in"
        style={{
          zIndex: 200,
          top: "50%", // 調整到中央
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: fadeOut ? "fadeOut 1s forwards" : "none",
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
          <div style={{ opacity: showCategoryA ? 1 : 0.2, transition: "opacity 0.5s" }}>
            <span style={{ color: "#ffbb00" }}>●</span> 廣告點擊行為: {showCategoryA ? Math.floor(displayCount * 0.15 / 1000) : 0}K+
          </div>
          <div style={{ opacity: showCategoryB ? 1 : 0.2, transition: "opacity 0.5s" }}>
            <span style={{ color: "#ff8a00" }}>●</span> 閱覽興趣偏好: {showCategoryB ? Math.floor(displayCount * 0.22 / 1000) : 0}K+
          </div>
          <div style={{ opacity: showCategoryC ? 1 : 0.2, transition: "opacity 0.5s" }}>
            <span style={{ color: "#26c6da" }}>●</span> 零售消費行為: {showCategoryC ? Math.floor(displayCount * 0.18 / 1000) : 0}K+
          </div>
        </div>
        
        {/* 動畫進度指示器 - 僅在開發模式顯示 */}
        <div style={{ marginTop: "10px", fontSize: "0.7rem", color: "#aaaaaa" }}>
          動畫進度: {Math.floor(internalProgress)}%
          {animationComplete && <span style={{ color: "#26c6da" }}> (完成)</span>}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDatabase;
